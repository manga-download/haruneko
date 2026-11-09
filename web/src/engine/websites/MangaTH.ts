import { Tags } from '../Tags';
import icon from './MangaTH.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    id: string;
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: string;
    chapterNumber: number;
};

type APIPages = {
    pages: {
        imageUrl: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangath', 'MangaTH', 'https://manga-th.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Thai, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title} = await FetchJSON<APIManga>(new Request(new URL(`./content/manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./content', this.apiURL)));
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./content/manga/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ id, chapterNumber }) => new Chapter(this, manga, `${id}`, `Chapter ${chapterNumber}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }
}