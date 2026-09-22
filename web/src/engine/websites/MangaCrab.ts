import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: number;
    title: string;
};

type APIMangas = {
    items: APIManga[];
};

type APIChapter = {
    index: number;
    title: string;
    security?: {
        enabled: 1 | 0;
        header: string;
    };
    content: {
        pages: string[];
    };
}
type APIChapters = {
    items: APIChapter[];
};

type PageParameter = {
    header: string;
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/mv/`;

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://es.mangacrab.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+/?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./mangas/by-slug/${url.split('/').filter(Boolean).at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?page=${page}&per_page=100nsfw=true&nsfw_only=false`, this.apiURL)));
                const mangas = items.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./mangas/${manga.Identifier}/chapters?per_page=5000`, this.apiURL)));
        return items.map(({ index, title }) => new Chapter(this, manga, `${index}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameter>[]> {
        const { security, content: { pages } } = await FetchJSON<APIChapter>(new Request(new URL(`./mangas/${chapter.Parent.Identifier}/chapter?cap_index=${chapter.Identifier}`, this.apiURL)));
        const header = security?.enabled && security.header || '';

        return pages.map(page => {
            const mustAddHeader = !!header && page.includes(`/encript.php?`);
            return new Page<PageParameter>(this, chapter, new URL(page), { header: mustAddHeader ? header : undefined });
        });
    }

    public override async FetchImage(page: Page<PageParameter>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters.header) return Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link.href, {
                credentials: 'omit',
                signal: signal,
                headers: {
                    Origin: this.URI.origin,
                    Fansy: page.Parameters.header,
                    'Sec-Fetch-Site': 'same-site'
                }
            }));
            return response.blob();
        }, priority, signal);
    }
}
