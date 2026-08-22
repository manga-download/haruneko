import { Tags } from '../Tags';
import icon from './Roxinha.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    id: number;
    title: string;
    chapters: {
        id: number;
        chapterNumber: number;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;
    private token: string = undefined;

    public constructor() {
        super('roxinha', 'Roxinha', 'https://roxinha.online', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: update token after manual website interaction (i.e login)
        this.token = await FetchWindowScript<string>(new Request(new URL(this.URI)), `localStorage.getItem('token') ?? null;`, 500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIManga[]>('./manga');
        return mangas.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.reverse().map(({ id, chapterNumber }) => new Chapter(this, manga, `${id}`, `Capítulo ${chapterNumber}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { ticket } = await this.FetchAPI<{ ticket: string }>(`./manga/chapter/${chapter.Identifier}/access`);
        const { pages } = await this.FetchAPI<APIPages>(`./manga/chapter/${chapter.Identifier}`, {
            'X-Chapter-Access': ticket
        });
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, parameters: Record<string, string> = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiURL));
        if (parameters) Object.entries(parameters).forEach(([name, value]) => request.headers.set(name, value));
        if (this.token) request.headers.set('Authorization', `Bearer ${this.token}`);
        return FetchJSON<T>(request);
    }
}