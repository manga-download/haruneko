import { Tags } from '../Tags';
import icon from './SoraRaw.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Grouple from './decorators/Grouple';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';
import { XOR } from './Crypto';

type NEXTDATA<T> = {
    props: {
        pageProps: {
            data: T;
        };
    };
};

type SiteSettings = {
    apiImage: string;
};

type APIMangas = {
    list: APIManga[];
};

type APIManga = {
    name: string;
    slug: string;
    chapters: APIChapter[];
};

type APIMangaDetails = {
    manga: APIManga;
};

type APIChapter = {
    id: number;
    name?: number;
    title?: string;
    path: string;
    manga_id: number;
    _b?: string;
    _d?: string;
    _p?: string;
    _t?: string;
    uuid: string;
};

type APIChapterDetails = {
    chapter: APIChapter;
};

type CryptedPagesData = {
    d: string;
};

type PagesData = {
    b?: string;
    d?: string;
    p?: string;
    t?: string;
}[];

@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    private apiURL = 'https://api.mangarawgo.site';

    public constructor() {
        super('soraraw', 'SoraRaw', 'https://soraraw.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await super.Initialize(); // Trigger CloudFlare
        this.apiURL = (await FetchJSON<SiteSettings>(new Request(new URL('config.json', this.URI)))).apiImage;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { slug, name } } = await this.GetEmbeddedJSON<APIMangaDetails>(new URL(url));
        return new Manga(this, provider, `/manga/${slug}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                try {
                    const { list } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas_${page}.json`, this.URI)));
                    const mangas = list.map(({ slug, name }) => new Manga(this, provider, `/manga/${slug}`, name));
                    mangas.length > 0 ? yield* mangas : run = false;
                } catch {
                    run = false; break;
                }
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { chapters } } = await this.GetEmbeddedJSON<APIMangaDetails>(new URL(manga.Identifier, this.URI));
        return chapters.map(({ name, title, path }) => new Chapter(this, manga, `/manga/${path.replace('-ch-', '/ch-')}`, `${name ?? title}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { id, manga_id, uuid, _b, _d, _t, _p } } = await this.GetEmbeddedJSON<APIChapterDetails>(new URL(chapter.Identifier, this.URI));
        const { d } = await FetchJSON<CryptedPagesData>(new Request(new URL(`/${manga_id}/${id}.json`, this.apiURL)));
        const pagesData: PagesData = JSON.parse(GetUTF8FromBytes(XOR(this.B64Decode(d), GetBytesFromUTF8('/fuCkYou!!!'))));

        const AESKEY = GetBytesFromHex(uuid);
        const XORKEY = GetBytesFromUTF8('202508055d0db38bae2e86cc41649f90');

        return Promise.all(
            pagesData.map(async ({ b, d, p, t }) => {
                const sources = [
                    t && { host: _t, file: t },
                    p && { host: _p, file: p },
                    d && { host: _d, file: d },
                    b && { host: _b, file: b },
                ].filter(Boolean) as { host: string; file: string }[];

                const urls = await Promise.all(sources.map(s => this.GenerateFileName(s.host, s.file, XORKEY, AESKEY)));
                return new Page(this, chapter, new URL(urls[0]), { Referer: this.URI.href, mirrors: urls.slice(1) });
            })
        );
    }

    private async GenerateFileName(host: string, encryptedFileName: string, xorKey: Uint8Array<ArrayBuffer>, aesKey: Uint8Array<ArrayBuffer>): Promise<string> {
        const ciphertext = XOR(this.B64Decode(encryptedFileName), xorKey);
        const algorithm = { name: 'AES-CTR', counter: ciphertext.subarray(0, 16), length: 128 };
        const key = await crypto.subtle.importKey('raw', aesKey, algorithm, false, ['decrypt']);
        const filename = GetUTF8FromBytes(await crypto.subtle.decrypt(algorithm, key, ciphertext.subarray(16)));
        return `${host}/${filename}`;
    }

    private B64Decode(data: string): Uint8Array<ArrayBuffer> {
        return GetBytesFromBase64(data.replace(/-/g, '+').replace(/_/g, '/').trim().padEnd(data.length + (4 - data.length % 4) % 4, '='));
    }

    private async GetEmbeddedJSON<T>(uri: URL): Promise<T> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(uri), 'script#__NEXT_DATA__');
        return (JSON.parse(script.text) as NEXTDATA<T>).props.pageProps.data;
    }
}