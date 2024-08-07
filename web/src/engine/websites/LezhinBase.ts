import { type Tag, Tags } from '../Tags';
import icon from './Lezhin.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { Check, Secret, Text } from '../SettingsManager';
import type { Priority } from '../taskpool/TaskPool';
import { FetchImageAjax } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

export interface LezhinWindow extends Window {
    __LZ_PRODUCT__?: { all: Array<UIChapter> }
    __LZ_DATA__?: { all: Array<UIChapter> }
    __LZ_CONFIG__?: LZConfig
}

export interface LZConfig extends JSONObject {
    contentsCdnUrl: string
    token: string
}

export interface APIKeyPair {
    code: number
    description: string
    data: {
        Policy: string
        Signature: string
        "Key-Pair-Id": string
        expiredAt: number
        now: number
    }
}

export interface EpisodeParameters extends JSONObject {
    episodeID: number
    comicID: number
    updatedAt: number
    shuffled: boolean
    purchased: boolean
    subscribed: boolean
}

export interface APIPages {
    code: number
    description: string
    data: {
        id: string
        extra: {
            subscribed: boolean
            comic: { metadata: { imageShuffle: boolean } }
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

export interface UIChapter extends JSONObject {
    id: number
    name: string
    display: {
        title: string
        type: string
        displayName: string
    }
    coin: number
    freedAt: number
    seq: number
    title: string
    purchased: boolean
    prefree: {
        closeTimer: {
            expiredAt: number
        }
    }
}

export interface APIMangasList {
    data: Array<{
        id: number,
        alias: string,
        title: string
    }>,
    hasNext: boolean,
    count: number,
    code:number
}

// The image is cut into 5x5 blocks and then scrambled
const SCRAMBLE_WIDTH_BLOCKS: number = 5
const SCRAMBLE_HEIGHT_BLOCKS: number = 5

export default abstract class extends DecoratableMangaScraper {
    protected readonly mangasPerPage: number = 500;
    protected readonly locale: string;

    protected apiURI: URL = new URL('https://www.lezhinus.com');
    protected cdnURI: URL = new URL('https://rcdn.lezhin.com');
    protected token?: string;

    public constructor(identifier: string, name: string, url: string, locale: string, languageTag: Tag) {       
        super(identifier, name, url, Tags.Media.Manhwa, Tags.Language.English, languageTag);

        this.locale = locale;
        this.token = undefined;

        this.Settings.username = new Text('username', R.Plugin_Lezhin_Settings_Username, R.Plugin_Lezhin_Settings_UsernameInfo, '');
        this.Settings.password = new Secret('password', R.Plugin_Lezhin_Settings_Password, R.Plugin_Lezhin_Settings_PasswordInfo, '');
        this.Settings.forceJPEG = new Check('forceJPEG', R.Plugin_Lezhin_Settings_Force_JPEG, R.Plugin_Lezhin_Settings_Force_JPEGInfo, false);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const data = await this.getLzConfig();
        if (data.contentsCdnUrl) {
            this.cdnURI = new URL(data.contentsCdnUrl);
        }
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: APIMangasList["data"] = [];
        for (let page = 0, hasNext = true; hasNext; page++) {
            const mangas = await this.fetchMangasFromPage(page);
            if (mangas.code != 0) {
                console.error('Failed to fetch from Lezhin, error code ' + mangas.code);
                break;
            }
            mangaList.push(...mangas.data);
            hasNext = mangas.hasNext;
        }
        return mangaList.map(element => new Manga(this, provider, element.alias, element.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await this.initializeAccount();
        const script = function(this: Window) {
            const product = (this as LezhinWindow).__LZ_PRODUCT__ ?? (this as LezhinWindow).__LZ_DATA__;
            if (!product) {
                return Promise.reject('Could not get chapters product data (LezhinBase:FetchChapters). Available keys are: '
                    + Object.keys(this.window).filter(a => (a > '__LZ^' && a < '__LZ`')).join(', '));
            }
            const chapters = product.all
                .filter(chapter => {
                    return ((chapter.purchased) 
                    || (chapter.coin === 0)
                    || (chapter.freedAt && chapter.freedAt < Date.now())
                    || (chapter.prefree && chapter.prefree.closeTimer && chapter.prefree.closeTimer.expiredAt > Date.now()));
                });
            return Promise.resolve(chapters);
        };

        const request = this.createRequest(new URL(`/comic/${manga.Identifier}`, this.URI));
        let chapters = await FetchWindowScript(request, script, 2500, 10000);
        return chapters.map((chap) => new Chapter(this, manga, chap.name,
            `${chap.display.displayName} - ${chap.display.title}`));
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        await this.initializeAccount();

        const script = function(this: Window, chapterName: string): Promise<boolean> {
            const product = (this as LezhinWindow).__LZ_PRODUCT__ ?? (this as LezhinWindow).__LZ_DATA__;
            if (!product) {
                return Promise.reject('Could not get chapters product data (LezhinBase:FetchPages). Available keys are: '
                    + Object.keys(this.window).filter(a => (a > '__LZ^' && a < '__LZ`')).join(', '));
            }
            const chapter = product.all.find(chapter => chapter.name == chapterName);
            return Promise.resolve(chapter.purchased);
        };

        const scriptText = `(${script})(
            ${this.stringToLiteral(chapter.Identifier)}
        )`;

        const purchasedRequest = this.createRequest(new URL(`/comic/${chapter.Parent.Identifier}`, this.URI));
        let purchased: boolean = await FetchWindowScript(purchasedRequest, scriptText, 2500, 10000);

        const uri = new URL('/lz-api/v2/inventory_groups/comic_viewer', this.apiURI);
        const params = new URLSearchParams ({
            'platform': 'web',
            'store': 'web',
            'alias': chapter.Parent.Identifier,
            'name': chapter.Identifier,
            'preload': 'false',
            'type': 'comic_episode'
        });
        uri.search = params.toString();
        const request = this.createRequest(uri);
        const content = await FetchJSON<APIPages>(request);

        const parameters: EpisodeParameters = {
            episodeID: content.data.extra.episode.id,
            comicID: content.data.extra.episode.idComic,
            updatedAt: content.data.extra.episode.updatedAt,
            shuffled: content.data.extra.comic.metadata?.imageShuffle ?? false,
            purchased: purchased,
            subscribed: content.data.extra.subscribed,
        };
        const extension = this.Settings.forceJPEG.Value ? '.jpg' : '.webp';

        const pages = content.data.extra.episode.pagesInfo ?? content.data.extra.episode.scrollsInfo;
        return pages.map((page) => {
            const url = new URL('/v2' + page.path + extension, this.cdnURI);
            return new Page(this, chapter, url, parameters);
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const parameters = page.Parameters as EpisodeParameters;

        const purchasedParam = (parameters.subscribed || parameters.purchased).toString();

        const tokenURI = new URL('/lz-api/v2/cloudfront/signed-url/generate', this.apiURI);
        const tokenParams = new URLSearchParams({
            'contentId': parameters.comicID.toString(),
            'episodeId': parameters.episodeID.toString(),
            'purchased': purchasedParam,
            'q': '40',
            'firstCheckType': 'P',
        });
        tokenURI.search = tokenParams.toString();

        const tokenRequest = this.createRequest(tokenURI,
            {'x-referer': this.apiURI.toString()});
        const tokenResponse = await FetchJSON<APIKeyPair>(tokenRequest);

        //update image url
        const imageParams = new URLSearchParams({
            'purchased': purchasedParam,
            'q': '40',
            'updated': parameters.updatedAt.toString(),
            'Policy': tokenResponse.data.Policy,
            'Signature': tokenResponse.data.Signature,
            'Key-Pair-Id': tokenResponse.data['Key-Pair-Id']
        });
        page.Link.search = imageParams.toString();

        const data = await FetchImageAjax.call(this, page, priority, signal, true);


        if (!parameters.shuffled) {
            return data
        }

        const scrambleTable = this.generateScrambleTable(parameters.episodeID, SCRAMBLE_HEIGHT_BLOCKS * SCRAMBLE_WIDTH_BLOCKS);

        return DeScramble(data, async (image, ctx) => {
            // TODO: Unscramble
        });

        return data;
    }

    protected async getLzConfig() {
        /*/__LZ_CONFIG__ is not available on frontpage anymore
        Therefore we get it from the /account page. If we are logged it works.
        In case we are not logged, /account redirect to /login and __LZ_CONFIG__ is still available.
        */
        const checkscript = function(this: Window) : Promise<LZConfig> {
            if ('__LZ_CONFIG__' in this) {
                return Promise.resolve(this.__LZ_CONFIG__ as LZConfig);
            } else {
                return Promise.reject('__LZ_CONFIG__ not found')
            }
        };
        const request = this.createRequest(new URL('/account', this.URI));
        return FetchWindowScript(request, checkscript, 2500, 10000);
    }

    protected async initializeAccount() {
        if(this.token) {
            //check if user disconnected
            const data = await this.getLzConfig();
            if (!data.token) {
                this.token = '';
            }
        }

        if(this.token || !this.Settings.username.Value || !this.Settings.password.Value) {
            return;
        }

        const script = function(this: Window, username: string, password: string): Promise<string> {
            const form = this.document.querySelector('form#email') as HTMLFormElement;
            const usernameBox = form.querySelector('input#login-email') as HTMLInputElement;
            const passwordBox = form.querySelector('input#login-password') as HTMLInputElement;
            usernameBox.value = username;
            passwordBox.value = password;

            const data = new URLSearchParams();
            for (const pair of new FormData(form)) {
                data.append(pair[0], pair[1].toString());
            }
            return this.fetch(form.action, {
                method: 'post',
                body: data,
            }).then((value: Response) => value.statusText);
        };

        const scriptText = `(${script})(
            ${this.stringToLiteral(this.Settings.username.Value as string)},
            ${this.stringToLiteral(this.Settings.password.Value as string)}
        )`;

        try {
            const request = this.createRequest(new URL('/login#email', this.URI));
            await FetchWindowScript(request, scriptText, 2500);
        } catch(error) {
            console.error(`Could not log in: Error ${error}`);
            return;
        }

        const data = await this.getLzConfig();
        this.token = data.token;
    }

    protected async fetchMangasFromPage(page: number): Promise<APIMangasList> {
        const uri = new URL('/lz-api/v2/contents', this.apiURI);
        const params = new URLSearchParams ({
            'menu': 'general',
            'limit': this.mangasPerPage.toString(),
            'offset': (page * this.mangasPerPage).toString(),
            'order': 'popular'
        });
        uri.search = params.toString();
        const request = this.createRequest(uri, {
            'X-LZ-Adult': '0',
            'X-LZ-AllowAdult': 'true',
        });
        return FetchJSON<APIMangasList>(request);
    }

    protected createRequest(url: URL, additionalHeaders: Record<string, string> = {}): Request {
        const headers: HeadersInit = {
            Referer: this.URI.origin,
            'x-cookie': `x-lz-locale=${this.locale.replace('-', '_')}`,
            'x-lz-locale': this.locale,
            ...additionalHeaders,
        };
        if (this.token) headers['authorization'] = ' Bearer ' + this.token;
        return new Request(url, {
            method: 'GET',
            //mode: 'cors',
            //redirect: 'follow',
            //credentials: 'same-origin',
            headers: headers
        });
    }

    protected stringToLiteral(str: string): string {
        return "'"
            + str.replace("\\", "\\\\").replace("$", "\\$").replace("'", "\\'")
            + "'";
    }

    protected generateScrambleTable(episodeID: number, numEls: number) : number[] {
        const u64Max = 0xFFFFFFFFFFFFFFFFn;
        const u32Max = 0xFFFFFFFFn;

        let order = [...Array(numEls).keys()];
        let randomState = BigInt(episodeID);

        for (let i = 0; i < numEls; i++) {
            randomState ^= (randomState >> 12n) & u64Max;
            randomState ^= (randomState << 25n) & u64Max;
            randomState ^= (randomState >> 27n) & u64Max;

            const r = Number(((randomState & u64Max) >> 32n) & u32Max) % numEls;
            [order[i], order[r]] = [order[r], order[i]];
        }

        return order;
    }
}