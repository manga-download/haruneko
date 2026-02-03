import type { Tag } from '../../Tags';
import icon from '../Lezhin.webp';
import { Fetch, FetchJSON, FetchNextJS, FetchWindowScript } from '../../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../../i18n/ILocale';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from '../decorators/Common';
import DeScramble from '../../transformers/ImageDescrambler';
import { Choice, Secret, Text } from '../../SettingsManager';
import { Exception } from '../../Error';
import { GetBytesFromBase64 } from '../../BufferEncoder';

// TODO : Handle Password and login change in plugin config
// TODO : Update CDN & force language after login attempt

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('h3.lzTypography').textContent.trim()
    };
}

function LoginScript(username: string, password: string,): string {
    return `
        new Promise(async (resolve, reject) => {
            try {
                if (!window.location.pathname.endsWith('/login')) resolve()
                else {
                    const form = document.querySelector('form[class^="login"]');
                    const body = JSON.stringify({
                        email: ${JSON.stringify(username)},
                        password: ${JSON.stringify(password)},
                        remember: 'false',
                        provider: 'email',
                        language: JSON.stringify(window.location.pathname.split('/').at(1))
                    });

                    const response = await fetch(new URL('./api/authentication/login', window.location.origin), {
                        method: 'POST',
                        body,
                        headers: {
                            'Content-type': 'application/json',
                        },
                    });
                    resolve(await response.json());
                }
            } catch (error) {
                reject(error);
            }
        });
    `;
}

type APIMangasList = {
    data: Array<{
        id: number;
        alias: string;
        title: string;
    }>,
    hasNext: boolean;
};

type APIKeyPair = {
    data: {
        Policy: string;
        Signature: string;
        'Key-Pair-Id': string;
        expiredAt: number;
        now: number;
    }
};

type EpisodeParameters = {
    episodeID: number;
    comicID: number;
    updatedAt: number;
    shuffled: boolean;
    purchased: boolean;
    subscribed: boolean;
};

type APIEpisode = {
    data: {
        episode: {
            isCollected: boolean;
        }
    }
};

type APIPages = {
    data: {
        id: string;
        extra: {
            subscribed: boolean;
            comic: {
                metadata?: {
                    imageShuffle: boolean;
                }
            }
            episode: {
                scrollsInfo?: Array<{ path: string }>;
                pagesInfo?: Array<{ path: string }>;
                updatedAt: number;
                id: number;
                idComic: number;
            }
        }
    }
};

type TPiece = {
    height: number;
    left: number;
    top: number;
    width: number;
};

type TPieceData = {
    from: TPiece;
    to: TPiece;
};

type TDimensions = {
    width: number;
    height: number;
};

type AuthData = {
    id: number;
    accessToken: string;
};

type DecodedToken = {
    exp: number;
};

type LoginResult = {
    appConfig: AuthData;
};

@Common.ChaptersSinglePageCSS('div#episode-list div[data-id] a ', undefined, ChapterExtractor)
export class LezhinBase extends DecoratableMangaScraper {
    protected locale: string;
    private readonly apiUrl = 'https://www.lezhinus.com/lz-api/v2/';
    private cdnURI: string;
    protected languagePath: string;
    private tokenProvider: TokenProvider;

    public constructor(identifier: string, name: string, url: string, tags: Tag[]) {
        super(identifier, name, url, ...tags);
        this.Settings.username = new Text('username', W.Plugin_Settings_Email, W.Plugin_Settings_EmailInfo, '');
        this.Settings.password = new Secret('password', W.Plugin_Settings_Password, W.Plugin_Settings_PasswordInfo, '');
        this.Settings.imageFormat = new Choice('image.format',
            W.Plugin_Settings_ImageFormat,
            W.Plugin_Settings_ImageFormatInfo,
            '.webp',
            { key: '.jpeg', label: E.Settings_Global_Format_JPEG },
            { key: '.webp', label: E.Settings_Global_Format_WEBP },
        );
        this.tokenProvider = new TokenProvider(this.URI);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.tokenProvider.SetCredentials(this.Settings.username.Value as string, this.Settings.password.Value as string, this.languagePath);
        await this.tokenProvider.Initialize();
        await this.UpdateCDN();
        await this.ForceLanguage();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/${this.languagePath}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, 'h2[class*="episodeListDetail__title__"]');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const mangasPerPage: number = 500;
        const uri = new URL(`./contents?menu=general&limit=${mangasPerPage}&order=popular`, this.apiUrl);
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                uri.searchParams.set('offset', `${page * mangasPerPage}`);
                const { data, hasNext } = await this.FetchAPI<APIMangasList>(uri, {
                    'X-LZ-Adult': '2',
                    'X-LZ-AllowAdult': 'true',
                });
                const mangas = data.map(({ alias, title }) => new Manga(this, provider, new URL(`/${this.languagePath}/comic/${alias}`, this.URI).pathname, title.trim()));
                yield* mangas;
                run = hasNext;
            }
        }.call(this));
    }

    public async FetchPages(chapter: Chapter): Promise<Page<EpisodeParameters>[]> {
        await this.tokenProvider.UpdateToken();

        const parameters: EpisodeParameters = {
            episodeID: undefined,
            comicID: undefined,
            updatedAt: undefined,
            shuffled: false,
            purchased: false,
            subscribed: false
        };

        //if we are logged check if purchased
        if (this.tokenProvider.IsLogged) {
            const uri = new URL(`https://www.lezhinus.com/lz-api/contents/v3/${chapter.Parent.Identifier.split('/').at(-1)}/episodes/${chapter.Identifier.split('/').at(-1)}?referrerViewType=NORMAL&objectType=comic`);
            const { data: { episode: { isCollected } } } = await this.FetchAPI<APIEpisode>(uri, {
                'X-LZ-Adult': '2',
                Referer: new URL(chapter.Identifier, this.URI).href
            });
            parameters.purchased = !!isCollected;
        }

        const uri = new URL(`./inventory_groups/comic_viewer?platform=web&store=web&preload=false&type=comic_episode&alias=${chapter.Parent.Identifier.split('/').pop()}&name=${chapter.Identifier.split('/').pop()}`, this.apiUrl);
        const { data: { extra: { comic, episode: { id, idComic, updatedAt, scrollsInfo, pagesInfo }, subscribed } } } = await this.FetchAPI<APIPages>(uri);

        parameters.episodeID = id;
        parameters.comicID = idComic;
        parameters.updatedAt = updatedAt;
        parameters.shuffled = !!comic.metadata?.imageShuffle;
        parameters.subscribed = subscribed;
        return (pagesInfo ?? scrollsInfo).map(({ path }) => new Page<EpisodeParameters>(this, chapter, new URL(`/v2${path}${this.Settings.imageFormat.Value}`, this.cdnURI), parameters));
    }

    public override async FetchImage(page: Page<EpisodeParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { comicID, episodeID, purchased, updatedAt, shuffled } = page.Parameters;
        const tokenURI = new URL(`./cloudfront/signed-url/generate?contentId=${comicID}&episodeId=${episodeID}&purchased=${purchased}&q=40&firstCheckType=P`, this.apiUrl);

        let keyPair: APIKeyPair = undefined;
        try {
            keyPair = await this.FetchAPI<APIKeyPair>(tokenURI);
        } catch {
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        }
        //update image url
        page.Link.search = new URLSearchParams({
            purchased: `${purchased}`,
            q: '40',
            updated: `${updatedAt}`,
            Policy: keyPair.data.Policy,
            Signature: keyPair.data.Signature,
            'Key-Pair-Id': keyPair.data['Key-Pair-Id']
        }).toString();

        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return !shuffled ? blob : DeScramble(blob, async (image, ctx) => {
            const NUM_COL_ROW = 5;
            const piecesData = new LehzinUnscrambler(episodeID, NUM_COL_ROW, image).GetPieces();
            for (const piece of piecesData) {
                ctx.drawImage(image, piece.to.left, piece.to.top, piece.to.width, piece.to.height, piece.from.left, piece.from.top, piece.from.width, piece.from.height);
            }
        });

    }

    private async UpdateCDN(): Promise<void> {
        const script = `(window.__LZ_CONFIG__?.contentsCdnUrl ?? JSON.parse(document.querySelector('#lz-static').dataset.env).CONTENT_CDN_URL)`;
        try {
            this.cdnURI = await FetchWindowScript<string>(new Request(new URL('./account', this.URI)), script) ?? null;
        } catch (error) {
            console.warn('UpdateCDN()', error);
            this.cdnURI = null;
        }
    }

    private async ForceLanguage(): Promise<void> {
        if (!this.tokenProvider.IsLogged) return;
        await Fetch(new Request(new URL(`./api/my-preference?userId=${this.tokenProvider.UserId}&lng=${this.languagePath}`, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(url: URL, additionalHeaders: HeadersInit = {}): Promise<T> {
        const request = new Request(url, {
            headers: await this.tokenProvider.ApplyAuthorizationHeader({
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'x-lz-locale': this.locale,
                ...additionalHeaders
            })
        });
        return FetchJSON<T>(request);
    }

}

/**
 * A basic oAuth token manager with Lezhin specific business logic
 */
class TokenProvider {

    #token: string = undefined;
    #userID: string = undefined;

    #username: string = undefined;
    #password: string = undefined;
    #expiration: number = undefined;
    #language: string = undefined;

    constructor(private readonly baseUrl: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {

        try {
            const { accessToken, id } = await FetchNextJS<AuthData>(new Request(this.baseUrl), data => 'accessToken' in data);
            this.#token = accessToken ? accessToken : undefined;
            this.#userID = id ? `${id}` : undefined;
            this.#expiration = accessToken ? this.#ExtractExpirationFromToken(accessToken) : undefined;
        }

        catch (error) {
            console.warn('UpdateToken()', error);
            this.#token = undefined;
            this.#userID = undefined;
            this.#expiration = undefined;
        }
    }

    get UserId() {
        return this.#userID;
    }

    public SetCredentials(username: string, password: string, language: string): void {
        this.#username = username;
        this.#password = password;
        this.#language = language;
    }

    get IsLogged(): boolean {
        return !!this.#userID;
    }

    public async Initialize(): Promise<void> {
        //try to get infos from website NEXTJS DATA first
        await this.UpdateToken();
        if (!this.#userID) await this.LoginAttempt();
    }

    public async LoginAttempt(): Promise<void> {
        //if token is defined , or we miss credential infos there is nothing to do.
        if (this.IsLogged || !this.#username || !this.#password) {
            return;
        }

        const { appConfig: { accessToken, id } } = await FetchWindowScript<LoginResult>(new Request(new URL(`./${this.#language}/login`, this.baseUrl)), LoginScript(this.#username, this.#password), 1500);

        if (accessToken) {
            this.#token = accessToken;
            this.#userID = `${id}`;
            this.#expiration = this.#ExtractExpirationFromToken(accessToken);
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
        const { exp } = JSON.parse(new TextDecoder().decode(GetBytesFromBase64(token.split('.').at(-1)))) as DecodedToken;
        return exp;
    }
}

/**
 * Lehzin pictures unscrambling logic
 */
class LehzinUnscrambler {
    private state: bigint;
    private scrambleTable: number[];
    private seed: number;
    private size: TDimensions = { width: 0, height: 0 };

    constructor(episodeId: number, numColAndRows: number, image: ImageBitmap) {
        this.seed = episodeId;
        this.state = BigInt(this.seed);
        const numPieces = numColAndRows * numColAndRows;
        const order = Array.from({ length: numPieces }, function (_, length) { return length; });
        for (let index = 0; index < order.length; index++) {
            const s = this.Random(numPieces);
            const u = order[index];
            order[index] = order[s];
            order[s] = u;
        }
        this.scrambleTable = order;
        this.size.width = image.width;
        this.size.height = image.height;
    }

    private Random(t: number): number {
        const BigNumber = BigInt('18446744073709551615');
        let e = this.state;
        e = e ^ e >> BigInt(12);
        const shifter = e << BigInt(25) & BigNumber;
        e = e ^ shifter;
        e = e ^ e >> BigInt(27);
        this.state = e & BigNumber;
        return Number((e >> BigInt(32)) % BigInt(t));
    }

    private AddLength(array: number[]): number[] {
        return [].concat(array, [
            array.length,
            array.length + 1
        ]);
    }

    private CreateSuperArray(array: number[]): [string, number][] {
        //generate "0", "arraylength" array
        const indexArray = Array(array.length).fill(0).map((_, index) => index.toString());
        const resultArray = [];
        indexArray.map(element => resultArray.push([element, array[element]]));
        return resultArray;
    }

    private CalculatePiece(imageDimensions: TDimensions, numColAndRows: number, pieceIndex: number): TPiece {
        let width: number;
        let height: number;
        const numPieces = numColAndRows * numColAndRows;
        return pieceIndex < numPieces ? (
            width = Math.floor(imageDimensions.width / numColAndRows),
            height = Math.floor(imageDimensions.height / numColAndRows),
            {
                left: pieceIndex % numColAndRows * width,
                top: Math.floor(pieceIndex / numColAndRows) * height,
                width: width,
                height: height
            }
        ) : pieceIndex === numPieces ?
            0 === (width = imageDimensions.width % numColAndRows) ? null : {
                left: imageDimensions.width - width,
                top: 0,
                width: width,
                height: imageDimensions.height
            }
            :
            0 === (height = imageDimensions.height % numColAndRows) ? null : {
                left: 0,
                top: imageDimensions.height - height,
                width: imageDimensions.width - imageDimensions.width % numColAndRows,
                height: height
            };
    }

    public GetPieces(): TPieceData[] {
        const scrambleTableArray = this.CreateSuperArray(this.AddLength(this.scrambleTable));
        const arrayLength = Math.floor(Math.sqrt(scrambleTableArray.length));
        const piecesData = scrambleTableArray.map(entry => {
            return {
                from: this.CalculatePiece(this.size, arrayLength, parseInt(entry[0])),
                to: this.CalculatePiece(this.size, arrayLength, entry[1])
            };
        }).filter(entry => {
            return !!entry.from && !!entry.to;
        });
        return piecesData;
    }
}