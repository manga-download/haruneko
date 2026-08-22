import { Tags } from '../Tags';
import icon from './Manga168.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: string;
    slug: string;
    title: string;
};

type APIMangaDetails = APIResult<{
    id_manga: number;
    post_title: string;
    slug?: string;
    ero_chapters: APIChapter[];
}>;

type APIChapter = {
    ero_chapter: string;
    post_title: string;
};

type APIMangas = APIResult<APIManga[]>;
type APIPages = APIResult<string[]>;

type HydratedChapter = {
    id: string;
    number: number;
    title: string;
};

type HydratedSeries = {
    id: string;
    slug: string;
    title: string;
    chapters: HydratedChapter[];
};

type HydratedManga = {
    initialData: {
        series: HydratedSeries[];
    };
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/manga/`;
    readonly #slugs = new Map<string, string>();

    public constructor() {
        super('manga168', 'Manga168', 'https://manga168x.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchNextJS<HydratedManga>(new Request(url), data => 'initialData' in data);
        const series = data?.initialData.series.at(0);
        if(!series?.id || !series.slug || !series.title) {
            throw new Error('Failed to extract manga information!');
        }
        this.#slugs.set(series.id, series.slug);
        return new Manga(this, provider, series.id, series.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?limit=500&page=${page}`, this.apiURL)));
                const mangas = data.map(({ id, slug, title }) => {
                    this.#slugs.set(id, slug);
                    return new Manga(this, provider, id, title);
                });
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        try {
            const series = await this.#FetchHydratedSeries(manga);
            return series.chapters.map(({ id, number, title }) => {
                const chapterID = id.replace(/^ch-/, '') || `${number}`;
                return new Chapter(this, manga, chapterID, title.replace(manga.Title, '').trim() || title);
            });
        } catch {
            const { data: { ero_chapters: chapters } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./mangas/${manga.Identifier}`, this.apiURL)));
            return chapters.map(({ ero_chapter: id, post_title: title }) => new Chapter(this, manga, `${id}`, title.replace(manga.Title, '').trim() || title));
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./mangas/${chapter.Parent.Identifier}/${chapter.Identifier}/images`, this.apiURL)));
        return data.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
    }

    async #FetchHydratedSeries(manga: Manga): Promise<HydratedSeries> {
        let slug = this.#slugs.get(manga.Identifier);
        if(!slug) {
            try {
                const { data } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./mangas/${manga.Identifier}`, this.apiURL)));
                slug = data.slug;
            } catch {}
        }
        if(!slug) {
            slug = manga.Title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }

        if(!slug) {
            throw new Error('Failed to resolve manga slug!');
        }

        const data = await FetchNextJS<HydratedManga>(new Request(new URL(`/manga/${slug}`, this.URI)), data => 'initialData' in data);
        const series = data?.initialData.series.find(series => series.id === manga.Identifier);
        if(!series?.chapters) {
            throw new Error('Failed to extract chapters from hydrated manga data!');
        }
        this.#slugs.set(series.id, series.slug);
        return series;
    }
}
