import { Tags } from '../Tags';
import icon from './Seitoon.webp';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
    meta: {
        cursor: string | null;
    };
};

type APIMangas = APIResult<{
    series: APIManga[];
}>;

type APIMangaDetails = APIResult<{
    series: APIManga;
}>;

type APIManga = {
    title: string;
    slug: string;
};

type APIChapters = APIResult<{
    chapters: {
        id: string;
        chapter_number: string;
    }[];
}>;

type APIPages = APIResult<{
    manifest: {
        assets: {
            id: string;
            variants: {
                desktop: {
                    delivery_token: string;
                    image_url: string;
                };
            };
            h?: boolean;
        }[];
    };
}>;

type PageToken = {
    token: string;
};

@Common.MangasSinglePageCSS<HTMLAnchorElement>('/browse', 'div.grid article > a', anchor => ({
    id: anchor.pathname.split('/').at(-1),
    title: anchor.querySelector('h3.text-white').textContent.trim()
}))
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('seitoon', 'Seitoon', 'https://seitoon.com.tr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { series: { slug, title } } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./catalog/series/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor: string = '';
            for (let run = true; run;) {
                const { data: { series }, meta: { cursor: nextCursor } } = await FetchJSON<APIMangas>(new Request(new URL(`./catalog/series/?cursor=${cursor}&limit=100`, this.apiURL)));
                const mangas = series.map(({ slug, title }) => new Manga(this, provider, slug, title));
                yield* mangas;
                nextCursor ? cursor = nextCursor : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            let cursor: string = '';
            for (let run = true; run;) {
                const { data: { chapters: chaptersData }, meta: { cursor: nextCursor } } = await FetchJSON<APIChapters>(new Request(new URL(`./catalog/series/${manga.Identifier}/chapters?cursor=${cursor}&limit=100`, this.apiURL)));
                const chapters = chaptersData.map(({ id, chapter_number: number }) => new Chapter(this, manga, id, `Bölüm ${parseFloat(number)}`));
                yield* chapters;
                nextCursor ? cursor = nextCursor : run = false;
            }
        }.call(this))).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageToken>[]> {
        // TODO : Revise code after Set-Cookie handling
        //chapter can be behind Cloudflare
        const { data: { manifest: { assets } } } = await FetchWindowScript<APIPages>(new Request(new URL(`/chapters/${chapter.Identifier}`, this.URI)), `
            new Promise (async (resolve, reject) => {
                try {
                    const response = await fetch('/api/v1/reader/chapters/${chapter.Identifier}/manifest');
                    resolve(await response.json());
                } catch (error) {
                    reject(error);
                }
            });
        `, 1500);
        return assets
            .filter(({ h }) => !h) // Remove honeypots
            .map(({ variants: { desktop: { image_url: url, delivery_token: token } } }) => new Page<PageToken>(this, chapter, new URL(url, this.URI), { token }));
    }

    public override async FetchImage(page: Page<PageToken>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                credentials: 'include',
                headers: {
                    Accept: 'image/*',
                    Referer: this.URI.href,
                    'X-Reader-Asset-Token': page.Parameters.token
                },
            }))).blob();
        }, priority, signal);
    }
}