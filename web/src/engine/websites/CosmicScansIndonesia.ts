import { Tags } from '../Tags';
import icon from './CosmicScansIndonesia.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromHex, GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';
import { XOR } from '../Crypto';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type APIResult<T> = {
    data: T;
};

type APIManga = APIResult<{
    slug: string;
    title: string;
}>;

type APIMangas = APIResult<APIManga['data'][]> & {
    cursor: {
        nextCursor: string;
    };
};

type APIChapters = APIResult<{
    chapters: {
        slug: string;
        chapterNum: string;
    }[];
}>;

type APIPages = APIResult<{
    pageCount: number;
}>;

type APISession = APIResult<{
    sessionId: string;
    axisKeys: string[];
}>;

AddAntiScrapingDetection(async invoke => invoke(`
    new Promise((resolve, reject) => {
        if(window.location.hash) {
            document.head.innerHTML = '';
            document.body.innerHTML = window.location.hash;
            return resolve(${FetchRedirection.None});
        }
        document.documentElement.innerHTML = '<head><meta charset="utf-8"><style>body { background-color: #ffffff; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; } @media (prefers-color-scheme: dark) { body { background-color: #121212; } }</style></head><body><div id="cf-turnstile"></div></body>';
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.onerror = reject;
        script.onload = () => window.turnstile.render('#cf-turnstile', {
            'sitekey': '0x4AAAAAAFrnsF7VWVgNrK9k',
            'callback': token => {
                window.location.hash = token;
                resolve(${FetchRedirection.Automatic});
                setTimeout(() => window.location.reload(), 500);
            },
            'before-interactive-callback': () => resolve(${FetchRedirection.Interactive}),
        });
        document.head.appendChild(script);
    });

`), /^https:\/\/\d+\.cosmicscans\.to\/chapter\//);

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://cdncid.csmcscns.id/v1/';

    public constructor() {
        super('cosmicscansid', 'Cosmic Scans Indonesia', 'https://04.cosmicscans.to', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe('^https://\\d+.cosmicscans.to/series/[^/]+/$').test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { title, slug } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/mangaDetail/${url.split('/').filter(Boolean).at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor: string;
            for (let run = true; run;) {
                const { data, cursor: { nextCursor } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/allComics?limit=100&after=${cursor}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `${slug}`, title));
                nextCursor ? cursor = nextCursor : run = false;
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/mangaDetail/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ slug, chapterNum }) => new Chapter(this, manga, slug, `Chapter ${chapterNum}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(`/chapter/${chapter.Identifier}`, this.URI);
        const token = await FetchWindowScript(new Request(chapterUrl), 'window.location.hash.slice(1)');

        const { data: { sessionId, axisKeys } } = await FetchJSON<APISession>(new Request(new URL(`./manga/img/session`, this.apiURL), {
            method: 'POST',
            body: JSON.stringify({ turnstile_token: token, chapter_slug: chapter.Identifier }),
            headers: {
                'Content-Type': 'application/json',
                Referer: this.URI.href,
            }
        }));

        const { data: { pageCount } } = await FetchJSON<APIPages>(new Request(new URL(`./manga/readingPage/${chapter.Identifier}`, this.apiURL)));

        return await Promise.all(Array.from({ length: pageCount }, async (_, pageIndex) => {
            return new Page(this, chapter, new URL(`${this.apiURL}manga/img/r/${sessionId}.${await this.ComputePageUrlSegment(chapter.Identifier, pageIndex, axisKeys)}`), { Referer: this.URI.href });
        }));
    }

    private async ComputePageUrlSegment(chapterSlug: string, pageIndex: number, keys: string[]): Promise<string> {
        const message = XOR(GetBytesFromUTF8(`${chapterSlug}:${pageIndex}:${Date.now() }`), GetBytesFromHex(keys[1]));
        const cryptoKey = await crypto.subtle.importKey('raw', GetBytesFromHex(keys[0]), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, message));
        return [GetURLBase64FromBytes(signature), GetURLBase64FromBytes(message)].join('.');
    }
}