import { Tags } from '../Tags';
import icon from './SoraRaw.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';

type NEXTDATA<T> = {
    pageProps: {
        data: T;
    }
};

type APIMangas = {
    list: APIManga[];
};

type APIManga = {
    id: number;
    name: string;
    slug: string;
    chapters: APIChapter[];
};

type APIMangaDetails = {
    manga: APIManga;
};

type APIChapter = {
    id: number;
    name: number;
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
    id: number;
    b?: string;
    d?: string;
    p?: string;
    t?: string;
}[];

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly nextPath = 'https://soraraw.com/_next/data/soraraw10/';
    private readonly pageApiUrl = 'https://api.mangarawgo.site';

    public constructor() {
        super('soraraw', 'SoraRaw', 'https://soraraw.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { slug, name } } = await this.FetchNextJSON<APIMangaDetails>(new URL(`.${new URL(url).pathname}.json`, this.nextPath));
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
        const { manga: { chapters } } = await this.FetchNextJSON<APIMangaDetails>(new URL(`.${manga.Identifier}.json`, this.nextPath));
        return chapters.map(({ name }) => new Chapter(this, manga, `${manga.Identifier}/ch-${name}`, `${name}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const XOR = (data: Uint8Array, key: Uint8Array) => data.map((byte, index) => byte ^ key[index % key.length]);
        const B64Decode = (data: string) => GetBytesFromBase64(data.replace(/-/g, '+').replace(/_/g, '/').trim().padEnd(data.length + (4 - data.length % 4) % 4, '='));

        const { chapter: { id, manga_id, uuid, _b, _d, _t, _p } } = await this.FetchNextJSON<APIChapterDetails>(new URL(`.${chapter.Identifier}.json`, this.nextPath));
        const { d } = await FetchJSON<CryptedPagesData>(new Request(new URL(`/${manga_id}/${id}.json`, this.pageApiUrl)));
        const pagesData: PagesData = JSON.parse(new TextDecoder().decode(XOR(B64Decode(d), GetBytesFromUTF8('/fuCkYou!!!'))));

        const AESKEY = GetBytesFromHex(uuid);
        const XORKEY = GetBytesFromUTF8('202508055d0db38bae2e86cc41649f90');

        return Promise.all(pagesData.map(async ({ b, d, p, t }) => {
            const host = t ? _t : p ? _p : d ? _d : _b;
            const encryptedFileName = t || p || d || b;
            const ciphertext = XOR(B64Decode(encryptedFileName), XORKEY);
            const algorithm = { name: 'AES-CTR', counter: ciphertext.subarray(0, 16), length: 128 };
            const key = await crypto.subtle.importKey('raw', AESKEY, algorithm, false, ['decrypt']);
            const pathname = new TextDecoder().decode(await crypto.subtle.decrypt(algorithm, key, ciphertext.subarray(16)));
            return new Page(this, chapter, new URL(`${host}/${pathname}`));
        }));
    }

    private async FetchNextJSON<T extends JSONElement>(uri: URL): Promise<T> {
        return (await FetchJSON<NEXTDATA<T>>(new Request(uri))).pageProps.data as T;
    }
}