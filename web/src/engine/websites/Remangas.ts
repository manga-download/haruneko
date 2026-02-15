import { Tags } from '../Tags';
import icon from './Remangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromURLBase64/*, GetBytesFromUTF8, GetHexFromBytes*/ } from '../BufferEncoder';

type APIMangas = {
    comics: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
};

type APIChapters = {
    chapters: {
        number: number;
        title: string | null;
        slug: string;
    }[];
};

type DecodedToken = {
    exp: number;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.detail-info-section .detail-title', (el, uri) => ({ id: uri.pathname.split('/').at(-1), title: el.textContent.trim() }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('img.longstrip-page')].map(img => img.src);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://xodneo.site/api/v1/';
    private readonly siteId = '00000000-0000-0000-0000-000000000001';
    //private readonly signatureKey = 'fe7f9e20851be60eb720015918784c68b4216fb05eb8ca4f20bec58ef2d3fffb';
    #tokenProvider: TokenProvider;

    public constructor() {
        super('remangas', 'Remangas', 'https://remangas.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
        this.#tokenProvider = new TokenProvider(this.URI);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        await this.#tokenProvider.UpdateToken();
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`./comics?page=${page}`);
                const mangas = comics.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters: chaptersData } = await this.FetchAPI<APIChapters>(`./comics/slug/${manga.Identifier}/chapters?page=${page}&per_page=500&sort=newest`);
                const chapters = chaptersData.map(({ number, title, slug }) => new Chapter(this, manga, `./ler/${manga.Identifier}/${slug}`, ['Capítulo', number, title ?? ''].join(' ').trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, /*useSignature = false*/): Promise<T> {
        await this.#tokenProvider.RefreshToken();
        //    const timestamp = Math.floor(Date.now() / 1000).toString();
        const url = new URL(endpoint, this.apiUrl);
        return FetchJSON<T>(new Request(url, {
            headers: await this.#tokenProvider.ApplyAuthorizationHeader({
                Referer: this.URI.href,
                Origin: this.URI.origin,
                //   ...useSignature && { 'X-Timestamp': timestamp },
                'X-Site-Id': this.siteId,
                //   ...useSignature && { 'X-Signature': await this.HMAC256([timestamp, 'GET', url.pathname].join('')) }
            })
        }));
    }
    /*
    private async HMAC256(data: string): Promise<string> {
        const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(this.signatureKey), algorithm, false, ['sign']);
        const signature = await crypto.subtle.sign(algorithm, key, GetBytesFromUTF8(data));
        return GetHexFromBytes(new Uint8Array(signature));
    }*/
}

/**
 * A basic oAuth token manager with Remangas specific business logic
 */
class TokenProvider {

    #token: string = undefined;
    #expiration: number = undefined;

    constructor(private readonly baseUrl: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {
        this.#token = await FetchWindowScript<null | string>(new Request(this.baseUrl), `cookieStore.get('token').then(({ value }) => decodeURIComponent(value) ?? null).catch(error => null)`);
        this.#expiration = this.#token ? this.#ExtractExpirationFromToken(this.#token) : undefined;
    }

    // Cookies expires after one day, so user is automatically logged out
    public async RefreshToken() {
        if (!this.#expiration || this.#expiration < Math.floor(Date.now() / 1000)) {
            await this.UpdateToken();
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

    #ExtractExpirationFromToken(token: string): number {
        const { exp } = JSON.parse(new TextDecoder().decode(GetBytesFromURLBase64(token.split('.').at(1)))) as DecodedToken;
        return exp;
    }
}