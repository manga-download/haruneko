import { Tags } from '../Tags';
import icon from './MangaTime.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    result: {
        data: {
            json: T;
        };
    };
}[];

type APIMangas = {
    results: APIManga[];
};

type APIManga = {
    id: string;
    title: string;
    slug: string;
};

type APIChapters = {
    chapters: {
        title: string;
        number: number;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/trpc/`;

    public constructor() {
        super('mangatime', 'MangaTime', 'https://mangatime.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, slug, title } = await this.FetchTRPC<APIManga>('./content.getSeriesBySlug?batch=1', {
            slug: url.split('/').at(-1)
        });
        return new Manga(this, provider, `${id}/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { results } = await this.FetchTRPC<APIMangas>('./search.searchSeries?batch=1', {
                    limit: 100,
                    page
                }, {
                    values: {
                        query: ['undefined'],
                        'filters.status': ['undefined'],
                        'filters.rating.min': ['undefined'],
                        'filters.rating.max': ['undefined'],
                        'filters.yearRange.from': ['undefined'],
                        'filters.yearRange.to': ['undefined'],
                        'filters.chapterCount.min': ['undefined'],
                        'filters.chapterCount.max': ['undefined'],
                        'filters.isColored': ['undefined'],
                        'filters.isCompleted': ['undefined'],
                        'filters.hasAdaptation': ['undefined']
                    },
                    v: 1
                });
                const mangas = results.map(({ id, slug, title }) => new Manga(this, provider, `${id}/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [seriesId] = manga.Identifier.split('/');
        const { chapters } = await this.FetchTRPC<APIChapters>(`./content.getChapters?batch=1`, {
            seriesId,
            limit: -1
        });
        return chapters.map(({ number, title }) => new Chapter(this, manga, `${number}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [, seriesSlug] = chapter.Parent.Identifier.split('/');
        const { pages } = await this.FetchTRPC<APIPages>(`./content.getChapterPages?batch=1`, {
            seriesSlug,
            chapterNumber: Number(chapter.Identifier)
        });
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private async FetchTRPC<T extends JSONElement>(endpoint: string, payload: JSONElement, meta: JSONElement = undefined): Promise<T> {
        const uri = new URL(endpoint, this.apiURL);
        uri.searchParams.set('input', JSON.stringify({
            0: {
                json: payload,
                ...meta && { meta }
            }
        }));

        const [{ result: { data: { json } } }] = await FetchJSON<APIResult<T>>(new Request(new URL(uri), {
            headers: {
                'X-MT-Platform': 'web',
                'X-MT-UIMode': 'standard',
                Referer: this.URI.href
            }
        }));
        return json;
    };
}