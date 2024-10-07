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
        title: anchor.querySelector('div[class*=style_episodeListContentsItem__title]').textContent.trim()
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
enum ChapterAccess { MUST_LOGIN = -1, NOT_PURCHASED = 0, PURCHASED = 1 }

const ChapterAccessScript = `
    new Promise ( resolve => resolve(!window.__LZ_DATA__ ? ${ChapterAccess.MUST_LOGIN} : __LZ_DATA__.purchased?.includes(__LZ_DATA__.episode.id) ? ${ChapterAccess.PURCHASED}: ${ChapterAccess.NOT_PURCHASED}))
`;

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

type APIPages = {
    data: {
        id: string
        extra: {
            subscribed: boolean
            comic: {
                metadata: {
                    imageShuffle: boolean
                }
            }
            episode: {
                scrollsInfo?: Array<{ path: string }>
                pagesInfo?: Array<{ path: string }>
                updatedAt: number
                id: number
                idComic: number
            }
        }
    }
}

type TPiece = {
    height: number,
    left: number,
    top: number,
    width:number
}

type TDimensions = {
    width: number
    height: number,
}

@Common.ChaptersSinglePageCSS('ul[class*=style_episodeListContents__list] li a', ChapterExtractor)
export default class extends DecoratableMangaScraper {
    private readonly locale: string;
    private readonly apiUrl = 'https://www.lezhinus.com/lz-api/v2/';
    private cdnURI: string;
    private token?: string;
    private languagePath: string;

    public constructor(identifier: string, name: string, url: string, locale: string, languagePath: string, tags: Tag[]) {
        super(identifier, name, url, ...tags);
        this.locale = locale;
        this.token = undefined;
        this.languagePath = languagePath;

        this.Settings.username = new Text('username', W.Plugin_Lezhin_Settings_Username, W.Plugin_Lezhin_Settings_UsernameInfo, '');
        this.Settings.password = new Secret('password', W.Plugin_Lezhin_Settings_Password, W.Plugin_Lezhin_Settings_PasswordInfo, '');
        this.Settings.forceJPEG = new Check('forceJPEG', W.Plugin_Lezhin_Settings_Force_JPEG, W.Plugin_Lezhin_Settings_Force_JPEGInfo, false);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const { contentsCdnUrl, token } = await this.GetLzConfig();
        this.token = token;
        this.cdnURI = contentsCdnUrl ? contentsCdnUrl : 'https://rcdn.lezhin.com';
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/${this.languagePath}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, 'h2[class*="style_episodeListDetail__title__"]');
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
        const params = new URLSearchParams({
            menu: 'general',
            limit: mangasPerPage.toString(),
            offset: (page * mangasPerPage).toString(),
            order: 'popular'
        });
        uri.search = params.toString();
        const request = this.CreateRequest(uri, {
            'X-LZ-Adult': '0',
            'X-LZ-AllowAdult': 'true',
        });

        const { data, hasNext } = await FetchJSON<APIMangasList>(request);
        const mangas = data.map(manga => new Manga(this, provider, new URL(`/${this.languagePath}/comic/${manga.alias}`, this.URI).pathname, manga.title.trim()));
        return { mangas, hasNext };
    }

    public async FetchPages(chapter: Chapter): Promise<Page<EpisodeParameters>[]> {
        await this.InitializeAccount();

        const chapterAccessRequest = this.CreateRequest(new URL(chapter.Identifier, this.URI));
        const chapterAccess = await FetchWindowScript<ChapterAccess>(chapterAccessRequest, ChapterAccessScript, 4000);

        //Avoid unauthorized error on pictures fetch later if we need login to see chapter. Even FREE, a chapter may require login.
        if (chapterAccess === ChapterAccess.MUST_LOGIN) {
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        }

        const uri = new URL('inventory_groups/comic_viewer', this.apiUrl);
        const params = new URLSearchParams({
            platform: 'web',
            store: 'web',
            alias: chapter.Parent.Identifier.split('/').pop(),
            name: chapter.Identifier.split('/').pop(),
            preload: 'false',
            type: 'comic_episode'
        });
        uri.search = params.toString();
        const content = await FetchJSON<APIPages>(this.CreateRequest(uri));

        const parameters: EpisodeParameters = {
            episodeID: content.data.extra.episode.id,
            comicID: content.data.extra.episode.idComic,
            updatedAt: content.data.extra.episode.updatedAt,
            shuffled: content.data.extra.comic.metadata?.imageShuffle ?? false,
            purchased: chapterAccess === ChapterAccess.PURCHASED,
            subscribed: content.data.extra.subscribed,
        };

        const extension = this.Settings.forceJPEG.Value ? '.jpg' : '.webp';
        const pages = content.data.extra.episode.pagesInfo ?? content.data.extra.episode.scrollsInfo;
        return pages.map(page => new Page<EpisodeParameters>(this, chapter, new URL('/v2' + page.path + extension, this.cdnURI), parameters));
    }

    public override async FetchImage(page: Page<EpisodeParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const parameters = page.Parameters;
        const purchasedParam = (parameters.subscribed || parameters.purchased).toString();

        const tokenURI = new URL('cloudfront/signed-url/generate', this.apiUrl);
        const tokenParams = new URLSearchParams({
            contentId: parameters.comicID.toString(),
            episodeId: parameters.episodeID.toString(),
            purchased: purchasedParam,
            q: '40',
            firstCheckType: 'P',
        });

        tokenURI.search = tokenParams.toString();
        const { data } = await FetchJSON<APIKeyPair>(this.CreateRequest(tokenURI));

        //update image url
        const imageParams = new URLSearchParams({
            purchased: purchasedParam,
            q: '40',
            updated: parameters.updatedAt.toString(),
            Policy: data.Policy,
            Signature: data.Signature,
            'Key-Pair-Id': data['Key-Pair-Id']
        });
        page.Link.search = imageParams.toString();
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);

        return !parameters.shuffled ? blob : DeScramble(blob, async (image, ctx) => {

            const NUM_COL_ROW = 5;
            const scrambleTableArray = CreateSuperArray(AddLength(GenerateScrambleTable(parameters.episodeID, NUM_COL_ROW )));
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
        return FetchWindowScript<LZConfig>(this.CreateRequest(new URL('/account', this.URI)), '__LZ_CONFIG__', 2500);
    }

    private async InitializeAccount() {

        //refresh token, in any case
        this.token = (await this.GetLzConfig()).token;

        //if token is defined , or we miss credential infos there is nothing to do.
        if (this.token || !this.Settings.username.Value || !this.Settings.password.Value) {
            return;
        }
        const username = this.Settings.username.Value as string;
        const password = (this.Settings.password.Value as string).replaceAll("'", "\\'");//Escape password because its injected between single quotes

        //attempt login (that works)
        await FetchWindowScript(new Request(new URL(`/${this.languagePath}/login`, this.URI)), LoginScript(username, password), 1500 );

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
        if (this.token) headers['authorization'] = ' Bearer ' + this.token;
        return new Request(url, {
            method: 'GET',
            headers: headers
        });
    }

}

function GenerateScrambleTable(episodeid: number, numColAndRows: number) : number[]{
    return episodeid ? new LezhinRandomizer(episodeid, numColAndRows).Get() : [];
}
class LezhinRandomizer {

    private state: bigint;
    private order: number[];
    private seed: number;

    private Random(t: number): number {
        const BIGT = BigInt(t);
        const big12 = BigInt(12);
        const big25 = BigInt(25);
        const big27 = BigInt(27);
        const big32 = BigInt(32);
        const BigXXX = BigInt('18446744073709551615');

        let e = this.state;
        e = e ^ e >> big12;
        const shifter = e << big25 & BigXXX;
        e = e ^ shifter;
        e = e ^ e >> big27;
        this.state = e & BigXXX;

        return Number((e >> big32) % BIGT);
    }

    public Get(): number[] {
        return this.order;
    }

    constructor(episodeId: number, numColAndRows: number) {
        this.seed = episodeId;
        this.state = BigInt(this.seed);
        const numPieces = numColAndRows * numColAndRows;
        const order = Array.from({ length: numPieces }, function (_, length) { return length; });
        for (let a = 0; a < order.length;a++) {
            const s = this.Random(numPieces);
            const u = order[a];
            order[a] = order[s];
            order[s] = u;
        }
        this.order = order;
    }
}

function AddLength(array: number[]) : number[]{
    return [].concat(array, [
        array.length,
        array.length + 1
    ]);
}
function CreateSuperArray(array: number[]) : [string, number][]{
    //generate "0", "arraylength" array
    const indexArray = Array(array.length).fill(0).map((_, index) => index.toString());
    const resultArray = [];
    indexArray.map(element => resultArray.push([element, array[element]]));
    return resultArray;
}

function CalculatePiece(imageDimensions: TDimensions, numColAndRows: number, pieceIndex: number): TPiece {
    let width, height;
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
    ): pieceIndex === numPieces ?
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
        }
    ;
}