import { Tags } from '../Tags';
import icon from './StoneScape.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string;
    slug: string;
};

type APIMangas = {
    data: APIManga[];
};

type APIChapters = {
    chapters: {
        chapterId: string;
        chapterNumber: string;
        title: string;
    }[];
};

type APIPages = {
    pages: {
        url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('stonescape', 'StoneScape', 'https://stonescape.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./series/by-slug/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./series?page=1&limit=9999');
        return data.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./series/by-slug/${manga.Identifier}/chapters`);
        return chapters.map(({ chapterId, chapterNumber, title }) => new Chapter(this, manga, chapterId, ['Chapter', parseFloat(chapterNumber), title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./chapters/${chapter.Identifier}/pages`);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL)));
    }
}