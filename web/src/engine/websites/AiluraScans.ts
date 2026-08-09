import { Tags } from '../Tags';
import icon from './AiluraScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T
};

type APIManga = {
    title: string;
    slug: string;
};

type APIChapter = {
    _id: string;
    title: string;
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('ailurascans', 'Ailura Scans', 'https://ailurascans.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/seri/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./series/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIManga[]>(`./series?limit=9999`);
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./chapters?series=${manga.Identifier}&limit=9999`);
        return chapters.map(({ _id, title }) => new Chapter(this, manga, _id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./chapters?series=${chapter.Parent.Identifier}&includepages=true&limit=9999`);
        return chapters.find(({ _id }) => _id === chapter.Identifier).pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl)))).data;
    }

}