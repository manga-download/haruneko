import { Tags } from '../Tags';
import icon from './MangaLib.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    data: T,
    meta: {
        has_next_page: boolean,
    }
};

type ImageServers = APIResult<{
    imageServers: {
        id: string,
        url: string,
        site_ids: number[]
    }[]
}>;

type APIManga = APIResult<{
    name: string,
    rus_name: string | null,
    slug_url: string
}>;

type APIMangas = APIResult<APIManga['data'][]>;

type APIChapters = APIResult<{
    volume: string,
    number: string,
    name: string,
    branches: {
        branch_id: number | null,
        teams: {
            name: string
        }[]
    }[]
}[]>;

type APIPages = APIResult<{
    pages: {
        url: string
    }[]
}>;

type APIToken = {
    timestamp: number,
    expires_in: number,
    access_token: string,
    refresh_token: string,
};

/**
 * A basic oAuth token manager with MangaLib specific business logic
 */
class TokenProvider {

    #token: APIToken = null;

    constructor(private readonly clientURI: URL, private readonly oAuthURI: URL) {}

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {
        try {
            this.#token = await FetchWindowScript<APIToken>(new Request(this.clientURI), `JSON.parse(localStorage.getItem('auth') || null)?.token;`) ?? null;
        } catch(error) {
            console.warn('UpdateToken()', error);
            this.#token = null;
        }
    }

    /**
     * Refresh the current token in case of expiration
     */
    private async RefreshToken() {
        try {
            if (this.#token && this.#token.timestamp + this.#token.expires_in < Date.now() - 60_000) {
                const request = new Request(this.oAuthURI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        grant_type: 'refresh_token',
                        client_id: '1',
                        refresh_token: this.#token.refresh_token,
                        scope: '',
                    })
                });
                this.#token = await FetchJSON<APIToken>(request);
            }
        } catch(error) {
            console.warn('RefreshToken()', error);
            await this.UpdateToken();
        }
    }

    /**
     * Determine the _Bearer_ extracted from the current token and add it as authorization header to the given {@link init} headers (replacing any existing authorization header).
     * In case the _Bearer_ could not be extracted from the current token the authorization header will not be added/replaced.
     */
    public async ApplyAuthorizationHeader(init: HeadersInit): Promise<HeadersInit> {
        const headers = new Headers(init);
        if(this.#token?.access_token) {
            await this.RefreshToken();
            headers.set('Authorization', 'Bearer ' + this.#token.access_token);
        }
        return headers;
    }
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly tokenProvider: TokenProvider;
    private readonly apiUrl = 'https://api.cdnlibs.org/api/';
    private imageServerURL: string = 'https://img2.imglib.info';
    private siteID : number = 1;

    public constructor() {
        super('mangalib', 'MangaLib', 'https://mangalib.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
        this.tokenProvider = new TokenProvider(this.URI, new URL('./auth/oauth/token', this.apiUrl));
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const { data: { imageServers } } = await FetchJSON<ImageServers>(new Request(new URL('./constants?fields[]=imageServers', this.apiUrl)));
        this.imageServerURL = imageServers.find(server => server.id === 'main' && server.site_ids.includes(this.siteID))?.url ?? this.imageServerURL;
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        await this.tokenProvider.UpdateToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ru/manga/[^/]`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.split('/').at(-1);
        const { data: { slug_url, rus_name, name } } = await this.FetchAPI<APIManga>(`./manga/${slug}`);
        return new Manga(this, provider, slug_url, rus_name || name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(500);
            const { data, meta: { has_next_page } } = await this.FetchAPI<APIMangas>(`./manga?page=${page}&site_id[]=${this.siteID}`);
            mangaList.push(...data.map(manga => new Manga(this, provider, manga.slug_url, manga.rus_name || manga.name)));
            run = has_next_page;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.FetchAPI<APIChapters>(`./manga/${manga.Identifier}/chapters`);
        return data.reduce((accumulator: Chapter[], chapter) => {
            const title = chapter.number + (chapter.name ? ' - ' + chapter.name : '');
            const search = new URLSearchParams({ volume: chapter.volume, number: chapter.number, });
            const chapters = chapter.branches.map(branch => {
                let scanlators = '';
                if(chapter.branches.length > 1) {
                    scanlators = `[${branch.teams.map(team => team.name).join(', ')}]`;
                    search.set('branch_id', branch.branch_id?.toString() ?? '');
                }
                return new Chapter(this, manga, `./manga/${manga.Identifier}/chapter?${search}`, `${title} ${scanlators}`.trim());
            });
            return [ ...accumulator, ...chapters ];
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await this.FetchAPI<APIPages>(chapter.Identifier);
        return pages.map(page => new Page(this, chapter, new URL(this.imageServerURL + page.url)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            headers: await this.tokenProvider.ApplyAuthorizationHeader({
                'Site-Id': this.siteID.toString()
            }),
        });
        return FetchJSON<T>(request);
    }
}