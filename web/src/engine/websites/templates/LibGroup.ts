import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import * as Grouple from '../decorators/Grouple';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { Delay } from '../../BackgroundTimers';
import type { MirroredPage } from '../decorators/Grouple';

type APIResult<T> = {
    data: T;
    meta: {
        has_next_page: boolean;
    }
};

type APIServers = APIResult<{
    imageServers: {
        id: string;
        url: string;
        site_ids: number[];
    }[]
}>;

type APIManga = APIResult<{
    name: string;
    rus_name: string | null;
    slug_url: string;
}>;

type APIMangas = APIResult<APIManga['data'][]>;

type APIChapters = APIResult<{
    volume: string;
    number: string;
    name: string;
    branches: {
        branch_id: number | null;
        teams: {
            name: string;
        }[]
    }[]
}[]>;

type APIPages = APIResult<{
    pages: {
        url: string;
    }[]
}>;

type APIToken = {
    timestamp: number;
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

type TContentServers = {
    main: string;
    secondary: string;
    compress: string;
}

/**
 * A basic oAuth token manager with MangaLib specific business logic
 */
class TokenProvider {

    #token: APIToken = null;

    constructor(private readonly clientURI: URL, private readonly oAuthURI: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {
        try {
            this.#token = await FetchWindowScript<APIToken>(new Request(this.clientURI), `JSON.parse(localStorage.getItem('auth') || null)?.token;`, 1500) ?? null;
        } catch (error) {
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
                this.#token = await FetchJSON<APIToken>(new Request(this.oAuthURI, {
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
                }));
            }
        } catch (error) {
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
        if (this.#token?.access_token) {
            await this.RefreshToken();
            headers.set('Authorization', 'Bearer ' + this.#token.access_token);
        }
        return headers;
    }
}

@Grouple.ImageWithMirrors()
export class LibGroup extends DecoratableMangaScraper {

    private Servers: TContentServers = { main: '', secondary: '', compress: '' };
    private tokenProvider: TokenProvider;
    private apiUrl = 'https://api.cdnlibs.org/api/';
    private siteID: number = 1;

    public WithSiteID(number: number) {
        this.siteID = number;
        return this;
    }

    public SetAPI(apiUrl: string, authPath: string = './auth/oauth/token') {
        this.apiUrl = apiUrl;
        this.tokenProvider = new TokenProvider(this.URI, new URL(authPath, this.apiUrl));
    }

    public override async Initialize(): Promise<void> {
        const { data: { imageServers } } = await FetchJSON<APIServers>(new Request(new URL('./constants?fields[]=imageServers', this.apiUrl)));

        this.Servers.main = imageServers.find(({ id, site_ids: siteIds }) => id === 'main' && siteIds.includes(this.siteID))?.url;
        this.Servers.secondary = imageServers.find(({ id, site_ids: siteIds }) => id === 'secondary' && siteIds.includes(this.siteID))?.url;
        this.Servers.compress = imageServers.find(({ id, site_ids: siteIds }) => id === 'compress' && siteIds.includes(this.siteID))?.url;

        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        await this.tokenProvider.UpdateToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ru/manga/[^/]+`).test(url);
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
            mangaList.push(...data.map(({ name, rus_name: rusName, slug_url: slug }) => new Manga(this, provider, slug, rusName || name)));
            run = has_next_page;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.FetchAPI<APIChapters>(`./manga/${manga.Identifier}/chapters`);
        return data.reduce((accumulator: Chapter[], chapter) => {
            const { name, number, volume, branches } = chapter;
            const title = number + (name ? ' - ' + name : '');
            const search = new URLSearchParams({ volume, number });
            const chapters = branches.map(({ branch_id: branchId, teams }) => {
                let scanlators = '';
                if (branches.length > 1) {
                    scanlators = `[${teams.map(team => team.name).join(', ')}]`;
                    search.set('branch_id', `${branchId ?? ''}`);
                }
                return new Chapter(this, manga, `./manga/${manga.Identifier}/chapter?${search}`, `${title} ${scanlators}`.trim());
            });
            return [...accumulator, ...chapters];
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<MirroredPage[]> {
        const { data: { pages } } = await this.FetchAPI<APIPages>(chapter.Identifier);
        return pages.map(({ url }) =>
            new Page(this, chapter, new URL(`${this.Servers.main}${url}`), { Referer: this.URI.href, mirrors: [`${this.Servers.secondary}${url}`, `${this.Servers.compress}${url}`] }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: await this.tokenProvider.ApplyAuthorizationHeader({
                'Site-Id': `${this.siteID}`
            }),
        }));
    }
}