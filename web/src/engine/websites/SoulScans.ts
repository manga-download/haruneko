import { Tags } from '../Tags';
import icon from './SoulScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string;
    slug: string;
    units: APIChapter[];
};

type APIMangas = {
    data: APIManga[];
};

type APIChapter = {
    slug: string;
    title: string;
    pages: {
        image_url: string;
    }[];
};

type APIPages = {
    chapter: APIChapter;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://img.soulscans.org/api/';

    public constructor() {
        super('soulscans', 'Soul Scans', 'https://v1.soulscans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Scanlator, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`./series/comic/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./search?type=COMIC&page=${page}&limit=100`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { units } = await FetchJSON<APIManga>(new Request(new URL(`./series/comic/${manga.Identifier}`, this.apiURL)));
        return units.map(({ slug, title })=> new Chapter(this, manga, slug, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./series/comic/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ image_url: url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}