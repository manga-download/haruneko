import type { Tag } from '../../Tags';
import icon from '../Lezhin.webp';
import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
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

function LoginScript(username: string, password: string): string {
    return `
        new Promise((resolve, reject) => {
            if (document.cookie.split(';').some(cookie => cookie.split('=')[0].trim() === 'RSESSION')) revolve()
            else {
                const form = $('form#email');
                form.find('input#login-email').val('${username}');
                form.find('input#login-password').val('${password}');
                $.ajax({
                    type: 'POST',
                    url: form.prop('action'),
                    data: form.serialize(),
                    success: resolve,
                    error: reject
                });
            }
        });
    `;
}

type LZConfig = {
    contentsCdnUrl: string
    token: string
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

type TDimensions = {
    width: number
    height: number,
}

@Common.ChaptersSinglePageCSS('ul[class*=episodeListContents__list] li a', ChapterExtractor)
export class LezhinBase extends DecoratableMangaScraper {
    protected locale: string;
    private readonly apiUrl = 'https://www.lezhinus.com/lz-api/v2/';
    private cdnURI: string;
    private token?: string;
    protected languagePath: string;

    public constructor(identifier: string, name: string, url: string, tags: Tag[]) {
        super(identifier, name, url, ...tags);
        this.token = undefined;

        this.Settings.username = new Text('username', W.Plugin_Lezhin_Settings_Username, W.Plugin_Lezhin_Settings_UsernameInfo, '');
        this.Settings.password = new Secret('password', W.Plugin_Lezhin_Settings_Password, W.Plugin_Lezhin_Settings_PasswordInfo, '');
        this.Settings.forceJPEG = new Check('forceJPEG', W.Plugin_Lezhin_Settings_Force_JPEG, W.Plugin_Lezhin_Settings_Force_JPEGInfo, false);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.InitializeAccount();
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

        const uri = new URL('contents', this.apiUrl);
        uri.search = new URLSearchParams({
            menu: 'general',
            limit: mangasPerPage.toString(),
            offset: (page * mangasPerPage).toString(),
            order: 'popular'
        }).toString();

        const request = this.CreateRequest(uri, {
            'X-LZ-Adult': '2',
            'X-LZ-AllowAdult': 'true',
        });

        const { data, hasNext } = await FetchJSON<APIMangasList>(request);
        const mangas = data.map(manga => new Manga(this, provider, new URL(`/${this.languagePath}/comic/${manga.alias}`, this.URI).pathname, manga.title.trim()));
        return { mangas, hasNext };
    }

    public async FetchPages(chapter: Chapter): Promise<Page<EpisodeParameters>[]> {
        await this.InitializeAccount();

        const parameters: EpisodeParameters = {
            episodeID: undefined,
            comicID: undefined,
            updatedAt: undefined,
            shuffled: false,
            purchased: false,
            subscribed: false
        };

        //if we arelogged check if purchased
        if (this.token) {
            const uri = new URL(`https://www.lezhinus.com/lz-api/contents/v3/${chapter.Parent.Identifier.split('/').at(-1)}/episodes/${chapter.Identifier.split('/').at(-1)}`);
            uri.searchParams.set('referrerViewType', 'NORMAL');
            uri.searchParams.set('objectType', 'comic');
            const { data: { episode: { isCollected } } } = await FetchJSON<APIEpisode>(this.CreateRequest(uri, { 'X-LZ-Adult': '2', Referrer: new URL(chapter.Identifier, this.URI).href }));
            parameters.purchased = !!isCollected;
        }

        const uri = new URL('inventory_groups/comic_viewer', this.apiUrl);
        uri.search = new URLSearchParams({
            platform: 'web',
            store: 'web',
            alias: chapter.Parent.Identifier.split('/').pop(),
            name: chapter.Identifier.split('/').pop(),
            preload: 'false',
            type: 'comic_episode'
        }).toString();
        const { data: { extra: { comic, episode, subscribed } } } = await FetchJSON<APIPages>(this.CreateRequest(uri));

        parameters.episodeID = episode.id;
        parameters.comicID = episode.idComic;
        parameters.updatedAt = episode.updatedAt;
        parameters.shuffled = !!comic.metadata?.imageShuffle;
        parameters.subscribed= subscribed;

        const extension = this.Settings.forceJPEG.Value ? '.jpg' : '.webp';
        const pages = episode.pagesInfo ?? episode.scrollsInfo;
        return pages.map(page => new Page<EpisodeParameters>(this, chapter, new URL(`/v2${page.path}${extension}`, this.cdnURI), parameters));
    }

    public override async FetchImage(page: Page<EpisodeParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const parameters = page.Parameters;
        const tokenURI = new URL('cloudfront/signed-url/generate', this.apiUrl);
        tokenURI.search = new URLSearchParams({
            contentId: parameters.comicID.toString(),
            episodeId: parameters.episodeID.toString(),
            purchased: parameters.purchased.toString(),
            q: '40',
            firstCheckType: 'P',
        }).toString();

        let data: APIKeyPair = undefined;
        try {
            data = await FetchJSON<APIKeyPair>(this.CreateRequest(tokenURI));
        } catch {
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        }
        //update image url
        page.Link.search = new URLSearchParams({
            purchased: parameters.purchased.toString(),
            q: '40',
            updated: parameters.updatedAt.toString(),
            Policy: data.data.Policy,
            Signature: data.data.Signature,
            'Key-Pair-Id': data.data['Key-Pair-Id']
        }).toString();

        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return !parameters.shuffled ? blob : DeScramble(blob, async (image, ctx) => {

            const NUM_COL_ROW = 5;
            const scrambleTableArray = CreateSuperArray(AddLength(GenerateScrambleTable(parameters.episodeID, NUM_COL_ROW)));
            const arrayLength = Math.floor(Math.sqrt(scrambleTableArray.length));
            const dimensions: TDimensions = { width: image.width, height: image.height };

            const piecesData = scrambleTableArray.map(entry => {
                return {
                    from: CalculatePiece(dimensions, arrayLength, parseInt(entry[0])),
                    to: CalculatePiece(dimensions, arrayLength, entry[1])
                };
            }).filter(entry => {
                return !!entry.from && !!entry.to;
            });

            for (const piece of piecesData) {
                ctx.drawImage(image, piece.to.left, piece.to.top, piece.to.width, piece.to.height, piece.from.left, piece.from.top, piece.from.width, piece.from.height);
            }

        });

    }

    private async GetLzConfig(): Promise<LZConfig> {
        /*/__LZ_CONFIG__ is not available on frontpage anymore
        Therefore we get it from the /account page. If we are logged it works.
        In case we are not logged, /account redirect to /login and __LZ_CONFIG__ is still available.
        */

        const LzConfigScript = `
            new Promise ( resolve => {
                if (window.__LZ_CONFIG__) resolve(window.__LZ_CONFIG__)
                else {
                    resolve({
                        contentsCdnUrl : JSON.parse(document.querySelector('#lz-static').dataset.env).CONTENT_CDN_URL,
                        token : document.documentElement.innerHTML.match(/accessToken.*([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/)?.at(1)
                    });
                }
            });
        `;

        return FetchWindowScript<LZConfig>(this.CreateRequest(new URL('/account', this.URI)), LzConfigScript, 2500);
    }

    private async InitializeAccount() {
        const { contentsCdnUrl, token } = await this.GetLzConfig();

        //refresh token, in any case
        this.token = token;
        this.cdnURI = contentsCdnUrl;

        //if token is defined , or we miss credential infos there is nothing to do.
        if (this.token || !this.Settings.username.Value || !this.Settings.password.Value) {
            return;
        }
        const username = this.Settings.username.Value as string;
        const password = (this.Settings.password.Value as string).replaceAll("'", "\\'");//Escape password because its injected between single quotes

        //attempt login (that works)
        await FetchWindowScript(new Request(new URL(`/${this.languagePath}/login`, this.URI)), LoginScript(username, password), 1500);

        this.token = (await this.GetLzConfig()).token;

        //force Language
        await Fetch(this.CreateRequest(new URL(`/${this.languagePath}/locale/${this.locale}`, this.URI)));

    }

    private CreateRequest(url: URL, additionalHeaders: Record<string, string> = {}): Request {
        const headers: HeadersInit = {
            Referer: this.URI.origin,
            Cookie: `x-lz-locale=${this.locale.replace('-', '_')}`,
            'x-lz-locale': this.locale,
            ...additionalHeaders,
        };
        if (this.token) headers['authorization'] = ` Bearer ${this.token}`;
        return new Request(url, {
            method: 'GET',
            headers: headers
        });
    }

}

function GenerateScrambleTable(episodeid: number, numColAndRows: number): number[] {
    return episodeid ? new LezhinRandomizer(episodeid, numColAndRows).Get() : [];
}
class LezhinRandomizer {

    private state: bigint;
    private order: number[];
    private seed: number;

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

    public Get(): number[] {
        return this.order;
    }

    constructor(episodeId: number, numColAndRows: number) {
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
        this.order = order;
    }
}

function AddLength(array: number[]): number[] {
    return [].concat(array, [
        array.length,
        array.length + 1
    ]);
}
function CreateSuperArray(array: number[]): [string, number][] {
    //generate "0", "arraylength" array
    const indexArray = Array(array.length).fill(0).map((_, index) => index.toString());
    const resultArray = [];
    indexArray.map(element => resultArray.push([element, array[element]]));
    return resultArray;
}

function CalculatePiece(imageDimensions: TDimensions, numColAndRows: number, pieceIndex: number): TPiece {
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