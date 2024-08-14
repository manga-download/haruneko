import { Tags } from '../../Tags';
import icon from './BilibiliManhua.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import { Choice } from '../../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../../i18n/ILocale';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import * as Common from '../decorators/Common';
import type { JSONObject } from '../../../../../node_modules/websocket-rpc/dist/types';

type APIResult<T> = {
    code: number,
    msg: string,
    data: T
}

type APIManga = {
    season_id: number,
    title: string
}

type APIChapters = {
    id: number,
    title: string,
    ep_list: {
        id: number,
        is_locked: boolean,
        is_in_free: boolean,
        short_title: string,
        title: string
    }[]
}

type APIPages = {
    images: {
        x: number,
        y: number,
        path: string
    }[]
}

type APIImageToken = {
    url: string,
    token: string
}

type APICredential = {
    credential: string
}

type APIGetAccessToken = {
    access_token: string,
    refresh_token: string
}

type AccessCookie = {
    area: number,
    accessToken: string,
    refreshToken: string
}

const auhTokenScript = `
    new Promise(resolve => {
        window.cookieStore.get('access_token')
            .then(cookie => !cookie ? resolve(cookie) : resolve(decodeURIComponent(cookie.value))) ;
    });
`;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly areacode = { 1: 'us-user', 2: 'sg-user' };
    private readonly credentialsServer = 'https://%AREA%.bilibilicomics.com';
    private auth = {
        accessToken: '',
        refreshToken: '',
        area: 1,
    };
    private token_expires_at: number = -1;

    public constructor() {
        super('neteasecomic', `哔哩哔哩 漫画 (Bilibili Manhua)`, 'https://manga.bilibili.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official);

        this.Settings.format = new Choice('image.format',
            W.Plugin_Settings_ImageFormat,
            W.Plugin_Settings_ImageFormatInfo,
            '.jpeg',
            { key: '.jpeg', label: E.Settings_Global_Format_JPEG },
            { key: '.webp', label: E.Settings_Global_Format_WEBP },
            { key: '.png', label: E.Settings_Global_Format_PNG },
        );
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/detail/mc([\\d]+)`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data } = await this.FetchTwirp<APIResult<APIChapters>>('ComicDetail', {
            comic_id: parseInt(url.match(/\/mc(\d+)/)[1])
        });
        return new Manga(this, provider, data.id.toString(), data.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async GetMangasFromPage(page, provider): Promise<Manga[]> {
        const { data } = await this.FetchTwirp<APIResult<APIManga[]>>('ClassPage', {
            style_id: -1,
            area_id: -1,
            is_free: -1,
            is_finish: -1,
            order: 0,
            page_size: 18,
            page_num: page
        });
        return data.map(entry => new Manga(this, provider, entry.season_id.toString(), entry.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await this.GetToken();
        const { data } = await this.FetchTwirp<APIResult<APIChapters>>('ComicDetail', {
            comic_id: manga.Identifier
        });
        return data.ep_list
            .filter(entry => entry.is_in_free || !entry.is_locked)
            .map(entry => new Chapter(this, manga, entry.id.toString(), (entry.short_title + ' - ' + entry.title).trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await this.GetToken();
        let credentials: APIResult<APICredential> = null;
        let data: APIResult<APIPages> = null;

        //Using access_token from cookies, try to get token for unlocked chapters
        if (this.auth.accessToken) {
            credentials = await this.FetchWithAccessToken<APIResult<APICredential>>('GetCredential', {
                ep_id: chapter.Identifier,
                comic_id: chapter.Parent.Identifier,
                type: 1
            });
        }

        //if we got chapter credentials, fetch full chapter using them
        if (credentials && credentials.data && credentials.data.credential) {
            data = await this.FetchTwirp<APIResult<APIPages>>('GetImageIndex', {
                ep_id: chapter.Identifier,
                credential: credentials.data.credential
            });
        } else {
            //get only 2 picture for locked chapter or full pictures if free chapter
            data = await this.FetchTwirp<APIResult<APIPages>>('GetImageIndex', {
                ep_id: chapter.Identifier,
            });
        }

        const images = data.data.images.map(image => {
            const quality = this.GetImageSizeByQuality(image.x);
            const suffix = quality + 'w';
            //suffix += qualdata.quality ? '_' + qualdata.quality + 'q' : '';
            return image.path + '@' + suffix + (this.Settings.format.Value as string);
        });

        const finalImages = await this.FetchTwirp<APIResult<APIImageToken[]>>('ImageToken', {
            urls: JSON.stringify(images)
        });
        return finalImages.data.map(image => new Page(this, chapter, new URL(image.url + '?token=' + image.token)));

    }

    private GetImageSizeByQuality(imgWidth: number): number {
        const ratioArray = { "verypoor": 0.4, "poor": 0.5, "normal": 0.7, "good": 0.85, "veryhigh": 1 };
        const widthArray = { verypoor: 350, poor: 450, normal: 800, good: 1100, veryhigh: 1600 };
        /*
        const o = {
            imgWidth: width,
            quality: undefined
        };*/

        //sometimes pictures size from JSON are 0 in this case Bibili forces a 0.85 ratio ,"Good"quality.
        if (imgWidth < 1) {
            /*    o.imgWidth = widthArray.good;
                  return o;*/
            return widthArray.good;
        }

        //const choosedQuality = ratioArray[this.Settings.picquality.value];
        const choosedQuality = ratioArray['veryhigh'];
        const calcWidth = Math.floor(imgWidth * choosedQuality); //0.85
        switch (choosedQuality) {
            case ratioArray.verypoor:
                calcWidth > widthArray.verypoor && (imgWidth = widthArray.verypoor);
                break;
            case ratioArray.poor:
                calcWidth > widthArray.poor && (imgWidth = widthArray.poor);
                break;
            case ratioArray.normal:
                calcWidth > widthArray.normal && (imgWidth = widthArray.normal);
                break;
            case ratioArray.good:
                calcWidth > widthArray.good && (imgWidth = widthArray.good);
                break;
            case ratioArray.veryhigh:
                calcWidth > widthArray.veryhigh && (imgWidth = widthArray.veryhigh);
                break;
        }

        //if (this.config.forcepicturesize.value) o.imgWidth = Math.max(o.imgWidth, width);
        return imgWidth;
    }

    private async FetchTwirp<T>(path: string, body: JSONObject): Promise<T> {
        const uri = new URL(`/twirp/comic.v1.Comic/${path}`, this.URI);
        uri.search = new URLSearchParams({
            device: 'pc',
            platform: 'web',
            lang: 'cn',
            sys_lang: 'cn'
        }).toString();

        const request = new Request(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Origin: this.URI.origin,
                'Content-Type': 'application/json;charset=UTF-8',
                Referer: uri.href
            }
        });
        if (this.auth.accessToken) request.headers.set('Authorization', ' Bearer ' + this.auth.accessToken);
        return FetchJSON<T>(request);
    }

    private async FetchWithAccessToken<T>(path: string, body: JSONObject): Promise<T> {
        const server = this.credentialsServer.replace('%AREA%', this.areacode[this.auth.area]);
        const uri = new URL('/twirp/global.v1.User' + path, server);
        uri.search = new URLSearchParams({
            device: 'pc',
            platform: 'web',
            lang: 'cn',
            sys_lang: 'cn'
        }).toString();

        const request = new Request(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Origin: this.URI.origin,
                'Content-Type': 'application/json;charset=utf-8',
                Referer: uri.href,
                Authorization: ' Bearer ' + this.auth.accessToken
            }
        });
        return FetchJSON<T>(request);
    }

    private async GetToken() {
        try {
            const now = Math.floor(Date.now() / 1000);
            const result = await FetchWindowScript<string>(new Request(this.URI), auhTokenScript, 500);

            //if there is no cookie user is disconnected, force cleanup
            if (!result) throw new Error('User is not connected.');

            const authJson: AccessCookie = JSON.parse(decodeURIComponent(result));

            //if token is not defined, get it from cookies
            if (!this.auth.accessToken) {
                this.auth.area = authJson.area;
                this.auth.accessToken = authJson.accessToken;
                this.auth.refreshToken = authJson.refreshToken;
                this.token_expires_at = now + 60 * 10; //expires in 10 minutes
                return;
            }

            //if token exists check if expired and refresh it if needed
            if (this.auth.accessToken && this.token_expires_at < now) {
                await this.RefreshToken();
                return;
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        } catch (error) {
            this.auth.accessToken = '';
            this.auth.refreshToken = '';
            this.auth.area = 1;
            this.token_expires_at = -1;

        }

    }

    private async RefreshToken() {
        try {
            const now = Math.floor(Date.now() / 1000);
            const { data } = await this.FetchWithAccessToken<APIResult<APIGetAccessToken>>('RefreshToken', { refresh_token: this.auth.refreshToken });
            this.auth.accessToken = data.access_token;
            this.auth.refreshToken = data.refresh_token;
            this.token_expires_at = now + 60 * 10;//expires in 10 minutes
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        } catch (error) {
            //
        }

    }
}