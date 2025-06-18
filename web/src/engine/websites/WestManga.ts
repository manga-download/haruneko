import { Tags } from '../Tags';
import icon from './WestManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T
}

type APIManga = {
    slug: string,
    title: string,
    chapters: APIChapter[]
}

type APIChapter = {
    title: string,
    slug: string
}

type APIPages = {
    images: string[]
}

function CleanTitle(title: string): string {
    return title.replace(/bahasa indonesia/i, '').trim();
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl: string = 'https://westmanga.me/api/';
    private readonly accessKey: string = 'WM_WEB_FRONT_END';
    private readonly secretKey: string = 'xxxoidj';

    public constructor() {
        super('westmanga', 'WestManga', 'https://westmanga.me', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data } = await this.FetchAPI<APIManga>(`./comic/${url.split('/').at(-1)}`);
        return new Manga(this, provider, data.slug, CleanTitle(data.title));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIManga[]>(`./contents?page=${page}`);
        return data.map(manga => new Manga(this, provider, manga.slug, CleanTitle(manga.title)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await this.FetchAPI<APIManga>(`./comic/${manga.Identifier}`);
        return chapters.map(chapter => {
            const title = CleanTitle(chapter.title.replace(manga.Title, ''));
            return new Chapter(this, manga, chapter.slug, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { images } } = await this.FetchAPI<APIPages>(`./v/${chapter.Identifier}`);
        return images.map(image => new Page(this, chapter, new URL(image)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, method: string = 'GET'): Promise<APIResult<T>> {
        const url = new URL(endpoint, this.apiUrl);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const request = new Request(url, {
            method,
            headers: {
                Referer: this.URI.href,
                'x-wm-request-time': timestamp,
                'x-wm-accses-key': this.accessKey, //not a typo
                'x-wm-request-signature': await this.HMAC256('wm-api-request', [timestamp, method, url.pathname, this.accessKey, this.secretKey].join(''))
            }
        });
        return FetchJSON<APIResult<T>>(request);
    }

    private async HMAC256(message: string, key: string): Promise<string> {
        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            GetBytesFromUTF8(key),
            {
                name: 'HMAC',
                hash: { name: 'SHA-256' }
            },
            false,
            ['sign', 'verify']
        );
        return GetHexFromBytes(new Uint8Array(await window.crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            GetBytesFromUTF8(message)
        )));
    }

}