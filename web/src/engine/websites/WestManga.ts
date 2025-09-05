import { Tags } from '../Tags';
import icon from './WestManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T | null;
};

type APIManga = {
    slug: string,
    title: string,
    chapters: APIChapter[];
};

type APIChapter = {
    number: string,
    slug: string;
};

type APIPages = {
    images: string[];
};

function CleanTitle(title: string): string {
    return title.replace(/bahasa indonesia/i, '').trim();
}

// TODO: Check for possible revision

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly api = {
        url: 'https://data.westmanga.me/api/',
        nonce: 'wm-api-request',
        accessKey: 'WM_WEB_FRONT_END',
        secretKey: 'xxxoidj',
    };

    public constructor () {
        super('westmanga', 'WestManga', 'https://westmanga.me', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { slug, title} } = await this.FetchAPI<APIManga>(`./comic/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, CleanTitle(title));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIManga[]>(`./contents?page=${page}`);
        return data ? data.map(({ slug, title}) => new Manga(this, provider, slug, CleanTitle(title))) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await this.FetchAPI<APIManga>(`./comic/${manga.Identifier}`);
        return chapters.map(({slug, number }) => new Chapter(this, manga, slug, number));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { images } } = await this.FetchAPI<APIPages>(`./v/${chapter.Identifier}`);
        return images.map(image => new Page(this, chapter, new URL(image)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<APIResult<T>> {
        const url = new URL(endpoint, this.api.url);
        const timestamp = `${Date.now()}`.slice(0, -3);
        const request = new Request(url, {
            headers: {
                Referer: this.URI.href,
                'X-Wm-Request-Time': timestamp,
                'X-Wm-Accses-Key': this.api.accessKey,
                'X-Wm-Request-Signature': await this.HMAC256(this.api.nonce, timestamp, 'GET', url.pathname, this.api.accessKey, this.api.secretKey)
            }
        });
        return FetchJSON<APIResult<T>>(request);
    }

    private async HMAC256(data: string, ...keyData: string[]): Promise<string> {
        const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(keyData.join('')), algorithm, false, [ 'sign' ]);
        const signature = await crypto.subtle.sign(algorithm, key, GetBytesFromUTF8(data));
        return GetHexFromBytes(new Uint8Array(signature));
    }
}