import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON } from '../../platform/FetchProvider';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../../BufferEncoder';
import DeScramble from '../../transformers/ImageDescrambler';
import type { Priority } from '../../taskpool/DeferredTask';

// TODO: Handle manual Logout from webview

type APIResultSuccess<T> = { data: T; error?: never; };
type APIResultError = { data?: never; error: { code: string; }; };
type APIResult<T> = APIResultSuccess<T> | APIResultError;

type APIManga = {
    id: number;
    alias: string;
    title: string;
    episodes: APIChapter[];
};

type APIMangas = {
    contents?: APIManga[];
    content?: APIManga[];
};

type APIChapter = {
    id: string;
    alias: string;
    title: string;
    subTitle: string;
};

type APIPages = {
    isScramble: boolean;
    images: ImageInfo;
};

type ImageInfo = {
    imagePath: string;
    line: string;
    point: string;
    defaultHeight: number;
}[];

type Token = {
    token: string;
    expiredAt: number;
};

type APIUser = {
    user?: {
        accessToken: Token;
        refreshToken: Token;
    },
};

type RefreshTokenResult = {
    result: {
        accessToken: Token;
        refreshToken: Token;
    };
};

type ScrambleParams = {
    scrambleIndex: number[];
    defaultHeight: number;
};

export class BalconyDRM {

    readonly #apiURL: URL;
    readonly #platform = 'WEB';
    private tokens: APIUser['user'] = undefined;

    constructor(private readonly webURL: URL, private readonly scope: string, private readonly timeZone: string) {
        this.#apiURL = new URL('/api/balcony-api-v2/', webURL);
    }

    #CreateRequest(endpoint: string, body: JSONElement | undefined = undefined, baseURL: URL = this.#apiURL): Request {
        const request = new Request(new URL(endpoint, baseURL), {
            method: body ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                Referer: this.webURL.href,
                'X-Balcony-Id': this.scope,
                'X-Platform': this.#platform,
                'X-balcony-timeZone': this.timeZone,
                ...this.tokens?.accessToken && { 'Authorization': `Bearer ${this.tokens.accessToken.token}` }
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return request;
    }

    #HasValidSession(): boolean {
        return (this.tokens && this.tokens.accessToken.expiredAt > Date.now() + 60_000) ?? false;
    }

    private async UpdateSession(): Promise<void> {
        try {
            // Update tokens. This will take care of logout and expiration from website itself
            const { user } = await FetchJSON<APIUser>(new Request(new URL('./api/auth/session', this.webURL)));
            this.tokens = user;

            // if session is valid? Return
            if (this.#HasValidSession()) return;

            // if we have tokens here it means its expired
            if (this.tokens) {
                // if refreshToken is expired, clear everything
                if (this.tokens?.refreshToken.expiredAt < Date.now() + 60_000) {
                    this.tokens = undefined;
                    return;
                } else { // else renew tokens
                    const { result } = await FetchJSON<RefreshTokenResult>(this.#CreateRequest('./api/balcony/auth/refresh',
                        {
                            accessToken: this.tokens.accessToken.token,
                            clientIp: '',
                            refreshToken: this.tokens.refreshToken.token
                        }, this.webURL));
                    this.tokens = result;
                }
            }
        } catch {
            this.tokens = undefined;
        }
    }

    public async FetchBalconyJSON<T extends JSONElement>(endpoint: string, body: JSONElement = undefined, checkSession: boolean = true): Promise<APIResult<T>> {
        if (checkSession) await this.UpdateSession();
        return FetchJSON<APIResult<T>>(this.#CreateRequest(endpoint, body));
    }
}

export class DelitoonBase extends DecoratableMangaScraper {
    private drm: BalconyDRM;
    private mangaSearchVersion = 2;

    public SetDRM(baseURI: URL, scope: string, timeZone: string): DelitoonBase {
        this.drm = new BalconyDRM(baseURI, scope, timeZone);
        return this;
    }

    public WithSearchVersion(version: number): DelitoonBase {
        this.mangaSearchVersion = version;
        return this;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).pathname.split('/').at(-1);
        const { data: { title } } = await this.drm.FetchBalconyJSON<APIManga>(`./contents/${mangaid}?isNotLoginAdult=true`);
        return new Manga(this, provider, mangaid, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            const endpoint = this.mangaSearchVersion === 1 ? './contents/search' : './search/all';
            return this.drm.FetchBalconyJSON<APIMangas | APIManga[]>(`${endpoint}?searchText=${character}&isCheckDevice=true&isIncludeAdult=true&contentsThumbnailType=MAIN`, undefined, false);
        });
        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangasArray = Array.isArray(element.data) ? element.data : element.data.contents ?? element.data.content;
            const mangas = mangasArray.map(({ alias, title }) => new Manga(this, provider, alias, title));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { episodes } } = await this.drm.FetchBalconyJSON<APIManga>(`./contents/${manga.Identifier}?isNotLoginAdult=true`);
        return episodes.map(({ title, subTitle, alias }) => new Chapter(this, manga, alias, subTitle ? `${title} : ${subTitle}` : title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParams>[]> {
        const { error, data } = await this.drm.FetchBalconyJSON<APIPages>(`./contents/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}?isNotLoginAdult=true`);
        switch (error?.code) {
            case 'NOT_LOGIN_USER':
            case 'UNAUTHORIZED_CONTENTS':
            case 'ADULT_ONLY_CONTENTS':
                throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { images, isScramble } = data;
        return isScramble ? this.FetchScrambledPages(chapter, images) : images.map(image => new Page(this, chapter, new URL(image.imagePath)));
    }

    private async FetchScrambledPages(chapter: Chapter, images: ImageInfo): Promise<Page<ScrambleParams>[]> {
        const { data } = await this.drm.FetchBalconyJSON<string>(`./contents/images/${chapter.Parent.Identifier}/${chapter.Identifier}`, { line: images[0].line });
        const keyData = GetBytesFromUTF8(data);
        const algorithm = { name: 'AES-CBC', iv: keyData.slice(0, 16), length: 256 };
        const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['decrypt']);
        const promises = images.map(async image => {
            const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromBase64(image.point));
            const scrambleIndex = JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as number[];
            return new Page<ScrambleParams>(this, chapter, new URL(image.imagePath), { scrambleIndex, defaultHeight: image.defaultHeight });
        });
        return Promise.all(promises);
    }

    public override async FetchImage(page: Page<ScrambleParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const scrambledata = page.Parameters;
        return !scrambledata?.scrambleIndex ? blob : DeScramble(blob, async (image, ctx) => {
            scrambledata.scrambleIndex.forEach((scramblevalue, index) => {
                const pieceWidth = image.width / 4;
                const pieceHeight = scrambledata.defaultHeight / 4;
                const sourceX = index % 4 * pieceWidth;
                const sourceY = Math.floor(index / 4) * pieceHeight;
                const destinationX = scramblevalue % 4 * pieceWidth;
                const destinationY = Math.floor(scramblevalue / 4) * pieceHeight;
                ctx.drawImage(image, sourceX, sourceY, pieceWidth, pieceHeight, destinationX, destinationY, pieceWidth, pieceHeight);
            });
        });
    }
}