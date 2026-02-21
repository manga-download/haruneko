import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

// TODO : Add Novel support.

type APIResult<T> = {
    data: T
};

type APIManga = {
    manga_id: number;
    titulo: string;
};

type APIChapter = {
    capitulo_id: number;
    capitulo_nome: string;
};

type APIPages = APIResult<{
    chapter: {
        baseUrl: string;
        hash: string;
        data?: string[];
    }
}>;

type APIChapters = APIResult<APIChapter[]>;

type APIMangas = APIResult<APIManga[]>;

@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api2.manhastro.net/';
    #token: null | string = null;

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        this.#token = await FetchWindowScript<string>(new Request(this.URI), `localStorage.getItem('token') || null;`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return (await this.GetAllMangas(provider)).find(manga => manga.Identifier === url.split('/').at(-1));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return await this.GetAllMangas(provider);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.FetchAPI<APIChapters>(`./dados/${manga.Identifier}`);
        return data
            .sort((self, other) => other.capitulo_id - self.capitulo_id)
            .map(({ capitulo_id: id, capitulo_nome: name }) => new Chapter(this, manga, id.toString(), name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { baseUrl, data, hash } } } = await this.FetchAPI<APIPages>(`./paginas/${chapter.Identifier}`);
        return data? data.map(page => new Page(this, chapter, new URL([baseUrl, hash, page].join('/')))): [];
    }

    private async GetAllMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./dados');
        return data.map(({ manga_id: id, titulo: title }) => new Manga(this, provider, id.toString(), title));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                ...this.#token && { Authorization: `Bearer ${this.#token}` }
            }
        }));
    }
}