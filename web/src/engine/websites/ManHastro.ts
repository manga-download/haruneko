import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T
};

type APIManga = {
    manga_id: number,
    titulo: string
};

type APIChapter = {
    capitulo_id: number,
    capitulo_nome: string
};

type APIPages = APIResult<{
    chapter: {
        baseUrl: string,
        hash: string,
        data: string[]
    }
}>;

type APIChapters = APIResult<APIChapter[]>;
type APIMangas = APIResult<APIManga[]>;

/**
 * A basic oAuth token manager with ManHastro specific business logic
 */
class TokenProvider {

    #token: string = null;

    constructor(private readonly clientURI: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {
        try {
            this.#token = await FetchWindowScript<string>(new Request(this.clientURI), `localStorage.getItem('token') || null);`) ?? null;
        } catch (error) {
            console.warn('UpdateToken()', error);
            this.#token = null;
        }
    }

    /**
     * Determine the _Bearer_ extracted from the current token and add it as authorization header to the given {@link init} headers (replacing any existing authorization header).
     * In case the _Bearer_ could not be extracted from the current token the authorization header will not be added/replaced.
     */
    public async ApplyAuthorizationHeader(init: HeadersInit): Promise<HeadersInit> {
        const headers = new Headers(init);
        if (this.#token) {
            headers.set('Authorization', 'Bearer ' + this.#token);
        }
        return headers;
    }
}

@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {
    private readonly tokenProvider: TokenProvider;
    private readonly apiUrl = 'https://api2.manhastro.net/';

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
        this.tokenProvider = new TokenProvider(this.URI);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.tokenProvider.UpdateToken();
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
            .map(chapter => new Chapter(this, manga, chapter.capitulo_id.toString(), chapter.capitulo_nome));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { baseUrl, data, hash } } } = await this.FetchAPI<APIPages>(`./paginas/${chapter.Identifier}`);
        return data.map(page => new Page(this, chapter, new URL([baseUrl, hash, page].join('/'))));
    }

    private async GetAllMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./dados');
        return data.map(manga => new Manga(this, provider, manga.manga_id.toString(), manga.titulo));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: await this.tokenProvider.ApplyAuthorizationHeader({}),
        }));
    }
}