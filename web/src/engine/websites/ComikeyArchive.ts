import { Tags } from '../Tags';
import icon from './ComikeyArchive.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    slug: string;
    title: string;
};

type APIChapter = APIManga;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly matchMangaPattern = new RegExp(`^${this.URI.origin}/read/([^/]+)/?$`);

    public constructor() {
        super('comikey-archive', 'Comikey (Archive)', 'https://cdn.comikey-cloud.workers.dev', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async Initialize(): Promise<void> {
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.matchMangaPattern.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.match(this.matchMangaPattern).at(-1);
        return (await this.FetchMangas(provider)).find(manga => manga.Identifier === id);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await this.FetchEndpoint<APIManga[]>('/read/0.json');
        return data.map(manga => new Manga(this, provider, manga.slug, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.FetchEndpoint<APIChapter[]>(`/read/${manga.Identifier}/0.json`);
        return data.map(chapter => new Chapter(this, manga, chapter.slug, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/read/${chapter.Parent.Identifier}/${chapter.Identifier}/`, this.URI);
        const data: string[] = await this.FetchEndpoint<string[]>(uri.pathname + '0.json');
        return data.map(image => new Page(this, chapter, new URL(image, uri), {}));
    }

    private FetchEndpoint<T extends JSONElement>(pathname: string): Promise<T> {
        const uri = new URL(pathname, this.URI);
        return FetchJSON<T>(new Request(uri));
    }
}