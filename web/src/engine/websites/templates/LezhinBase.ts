import type { Tag } from '../../Tags';
import icon from '../Lezhin.webp';
import { Fetch, FetchCSS, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { WebsiteResourceKey as W } from '../../../i18n/ILocale';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from '../decorators/Common';
import DeScramble from '../../transformers/ImageDescrambler';
import { Check, Secret, Text } from '../../SettingsManager';
import { Exception } from '../../Error';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div[class*=episodeListContentsItem__title]').textContent.trim()
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
                        email :  '${username}', 
                        password: '${password}',
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
        id: number,
        alias: string,
        title: string
    }>,
    hasNext: boolean,
}

type MangasList = {
    mangas: Manga[],
    hasNext: boolean
}

type APIKeyPair = {
    data: {
        Policy: string
        Signature: string
        'Key-Pair-Id': string
        expiredAt: number
        now: number
    }
}

type EpisodeParameters = {
    episodeID: number
    comicID: number
    updatedAt: number
    shuffled: boolean
    purchased: boolean
    subscribed: boolean
}

type APIEpisode = {
    data: {
        episode: {
            isCollected: boolean
        }
    }
}

type APIPages = {
    data: {
        id: string
        extra: {
            subscribed: boolean
            comic: {
                metadata?: {
                    imageShuffle: boolean
                }
            }
            episode: {
                scrollsInfo?: Array<{ path: string }>,
                pagesInfo?: Array<{ path: string }>,
                updatedAt: number,
                id: number,
                idComic: number,
            }
        }
    }
}

type TPiece = {
    height: number,
    left: number,
    top: number,
    width: number
}

type TPieceData = {
    from: TPiece,
    to: TPiece
}

type TDimensions = {
    width: number
    height: number,
}

type AuthData = {
    id: number,
    accessToken: string
}

/**
 * A basic oAuth token manager with Lezhin specific business logic
 */
class TokenProvider {

    #token: string = null;
    #userID: string = null;

    constructor(private readonly clientURI: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {

        try {
            const scripts = await FetchCSS<HTMLScriptElement>(new Request(this.clientURI), 'script:not([src])');
            const { accessToken, id } = this.ExtractData<AuthData>(scripts, 'accessToken', 'accessToken');
            this.#token = accessToken;
            this.#userID = id.toString();
        }

        catch (error) {
            console.warn('UpdateToken()', error);
            this.#token = null;
        }
    }

    get UserId() {
        return this.#userID;
    }

    public HasToken(): boolean {
        return !!this.#token;
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

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string, asObject = true): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return asObject ? parent : parent[keyName];
            }
            for (const child of (Object.values(parent) as JSONElement[]).filter(value => value && typeof value === 'object')) {
                const result = FindValueForKeyName(child);
                if (result) {
                    return result;
                }
            }
            return undefined;
        })(record) as T;
    }

}

@Common.ChaptersSinglePageCSS('ul[class*=episodeListContents__list] li a', ChapterExtractor)
export class LezhinBase extends DecoratableMangaScraper {
    protected locale: string;
    private readonly apiUrl = 'https://www.lezhinus.com/lz-api/v2/';
    private cdnURI: string;
    protected languagePath: string;
    private tokenProvider: TokenProvider;

    public constructor(identifier: string, name: string, url: string, tags: Tag[]) {
        super(identifier, name, url, ...tags);
        this.Settings.username = new Text('username', W.Plugin_Lezhin_Settings_Username, W.Plugin_Lezhin_Settings_UsernameInfo, '');
        this.Settings.password = new Secret('password', W.Plugin_Lezhin_Settings_Password, W.Plugin_Lezhin_Settings_PasswordInfo, '');
        this.Settings.forceJPEG = new Check('forceJPEG', W.Plugin_Lezhin_Settings_Force_JPEG, W.Plugin_Lezhin_Settings_Force_JPEGInfo, false);
        this.tokenProvider = new TokenProvider(new URL('./account/', this.URI));
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.LoginAttempt();
        await this.tokenProvider.UpdateToken();
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
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const { mangas, hasNext } = await this.GetMangasFromPage(page, provider);
            mangaList.push(...mangas);
            run = hasNext;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<MangasList> {
        const mangasPerPage: number = 500;

        const uri = new URL('./contents', this.apiUrl);
        uri.search = new URLSearchParams({
            menu: 'general',
            limit: mangasPerPage.toString(),
            offset: (page * mangasPerPage).toString(),
            order: 'popular'
        }).toString();

        const { data, hasNext } = await this.FetchAPI<APIMangasList>(uri, {
            'X-LZ-Adult': '2',
            'X-LZ-AllowAdult': 'true',
        });

        const mangas = data.map(manga => new Manga(this, provider, new URL(`/${this.languagePath}/comic/${manga.alias}`, this.URI).pathname, manga.title.trim()));
        return { mangas, hasNext };
    }

    public async FetchPages(chapter: Chapter): Promise<Page<EpisodeParameters>[]> {

        const parameters: EpisodeParameters = {
            episodeID: undefined,
            comicID: undefined,
            updatedAt: undefined,
            shuffled: false,
            purchased: false,
            subscribed: false
        };

        //if we are logged check if purchased
        if (this.tokenProvider.HasToken) {
            const uri = new URL(`https://www.lezhinus.com/lz-api/contents/v3/${chapter.Parent.Identifier.split('/').at(-1)}/episodes/${chapter.Identifier.split('/').at(-1)}`);
            uri.searchParams.set('referrerViewType', 'NORMAL');
            uri.searchParams.set('objectType', 'comic');
            const { data: { episode: { isCollected } } } = await this.FetchAPI<APIEpisode>(uri, {
                'X-LZ-Adult': '2',
                Referrer: new URL(chapter.Identifier, this.URI).href
            });
            parameters.purchased = !!isCollected;
        }

        const uri = new URL('./inventory_groups/comic_viewer', this.apiUrl);
        uri.search = new URLSearchParams({
            platform: 'web',
            store: 'web',
            alias: chapter.Parent.Identifier.split('/').pop(),
            name: chapter.Identifier.split('/').pop(),
            preload: 'false',
            type: 'comic_episode'
        }).toString();
        const { data: { extra: { comic, episode, subscribed } } } = await this.FetchAPI<APIPages>(uri);

        parameters.episodeID = episode.id;
        parameters.comicID = episode.idComic;
        parameters.updatedAt = episode.updatedAt;
        parameters.shuffled = !!comic.metadata?.imageShuffle;
        parameters.subscribed = subscribed;

        const extension = this.Settings.forceJPEG.Value ? '.jpg' : '.webp';
        const pages = episode.pagesInfo ?? episode.scrollsInfo;
        return pages.map(page => new Page<EpisodeParameters>(this, chapter, new URL(`/v2${page.path}${extension}`, this.cdnURI), parameters));
    }

    public override async FetchImage(page: Page<EpisodeParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { comicID, episodeID, purchased, updatedAt, shuffled } = page.Parameters;
        const tokenURI = new URL('./cloudfront/signed-url/generate', this.apiUrl);
        tokenURI.search = new URLSearchParams({
            contentId: comicID.toString(),
            episodeId: episodeID.toString(),
            purchased: purchased.toString(),
            q: '40',
            firstCheckType: 'P',
        }).toString();

        let keyPair: APIKeyPair = undefined;
        try {
            keyPair = await this.FetchAPI<APIKeyPair>(tokenURI);
        } catch {
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        }
        //update image url
        page.Link.search = new URLSearchParams({
            purchased: purchased.toString(),
            q: '40',
            updated: updatedAt.toString(),
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

    private async LoginAttempt(): Promise<void> {
        //if token is defined , or we miss credential infos there is nothing to do.
        if (this.tokenProvider.HasToken() || !this.Settings.username.Value || !this.Settings.password.Value) {
            return;
        }
        const username = this.Settings.username.Value as string;
        const password = (this.Settings.password.Value as string).replaceAll("'", "\\'");//Escape password because its injected between single quotes

        await FetchWindowScript(new Request(new URL(`/${this.languagePath}/login`, this.URI)), LoginScript(username, password), 1500);
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
        if (!this.tokenProvider.HasToken) return;
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