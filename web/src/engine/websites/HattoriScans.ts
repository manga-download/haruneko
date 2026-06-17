import { Tags } from '../Tags';
import icon from './HattoriScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    slug: string;
    title: string;
};

type APIChapters = {
    chapters: {
        slug: string;
        title: string;
        subtitle: string;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://hattoriscans.com/api/';

    public constructor() {
        super('hattoriscans', 'Hattori Scans', 'https://hattoriscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL(`./manga?limit=9999`, this.apiURL)));
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.map(({ slug, title, subtitle }) => new Chapter(this, manga, slug, [title, subtitle].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./manga/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}