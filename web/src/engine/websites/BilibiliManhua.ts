import { Tags } from '../Tags';
import icon from './BilibiliManhua.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Choice } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../i18n/ILocale';
import { FetchJSON, } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import type { JSONObject } from '../../../../node_modules/websocket-rpc/dist/types';
import type { Priority } from '../taskpool/DeferredTask';

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
    token: string,
    complete_url: string,
}

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('bilibilimanhua', `哔哩哔哩 漫画 (Bilibili Manhua)`, 'https://manga.bilibili.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Official);

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
        const { data: { id, title } } = await this.FetchTwirp<APIResult<APIChapters>>('ComicDetail', {
            comic_id: url.match(/\/mc(\d+)/)[1]
        });
        return new Manga(this, provider, id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
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
        return data.map(entry => new Manga(this, provider, entry.season_id.toString(), entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { ep_list } } = await this.FetchTwirp<APIResult<APIChapters>>('ComicDetail', {
            comic_id: manga.Identifier
        });
        return ep_list
            .filter(entry => entry.is_in_free || !entry.is_locked)
            .map(entry => new Chapter(this, manga, entry.id.toString(), [entry.short_title, entry.title].join(' - ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const body = {
            ep_id: chapter.Identifier
        };
        const { data: { images } } = await this.FetchTwirp<APIResult<APIPages>>('GetImageIndex', body);

        const pictures = images.map(image => {
            const quality = this.GetImageSizeByQuality(image.x);
            return `${image.path}@${quality}w${this.Settings.format.Value as string}`;
        });

        const { data } = await this.FetchTwirp<APIResult<APIImageToken[]>>('ImageToken', {
            urls: JSON.stringify(pictures)
        });

        return data.map(image => new Page(this, chapter, new URL(image.complete_url ?? `${image.url}?token=${image.token}`)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return blob.type.startsWith('image/') ? blob : this.DecryptImage(blob, page.Link);
    }

    private async DecryptImage(blob: Blob, link: URL): Promise<Blob> {

        const buffer = new Uint8Array(await blob.arrayBuffer());
        const dataLength = new DataView(buffer.slice(1, 5).buffer).getInt32(0, false);
        const imageData = buffer.slice(5, dataLength + 5);
        const key = buffer.slice(dataLength + 5);

        const cryptoParameters = { al: 'AES-CBC', an: [60, 76], at: [0, 20] };
        const decodedCpx = new Uint8Array(window.atob(decodeURIComponent(link.searchParams.get('cpx'))).split('').map(char => char.charCodeAt(0)));
        const iv = new Uint8Array(decodedCpx.buffer.slice(cryptoParameters.an[0], cryptoParameters.an[1]));

        const cryptedData = new Uint8Array(imageData.slice(cryptoParameters.at[0], cryptoParameters.at[1] * 1024 + 16));
        const rawData = imageData.slice(cryptoParameters.at[1] * 1024 + 16);

        const cryptoKey = await crypto.subtle.importKey('raw', key, {
            name: cryptoParameters.al,
        }, true, ['decrypt']);

        const decrypted = new Uint8Array(await crypto.subtle.decrypt({
            name: cryptoParameters.al,
            iv: iv
        }, cryptoKey, cryptedData));

        const finalData = new Uint8Array(decrypted.length + rawData.length);
        finalData.set(decrypted, 0);
        finalData.set(rawData, decrypted.length);
        return Common.GetTypedData(finalData.buffer);
    }

    private GetImageSizeByQuality(imgWidth: number): number {
        /* Quality array for references. we only use veryhigh anyway
        const ratioArray = { "verypoor": 0.4, "poor": 0.5, "normal": 0.7, "good": 0.85, "veryhigh": 1 };
        const widthArray = { verypoor: 350, poor: 450, normal: 800, good: 1100, veryhigh: 1600 };
        */

        //sometimes pictures size from JSON are 0 in this case Bibili forces a 0.85 ratio ,"Good"quality aka 1100px picture
        if (imgWidth < 1) {
            return 1100;
        } else return 1600;
    }

    private async FetchTwirp<T extends JSONObject>(path: string, body: JSONObject): Promise<T> {
        const uri = new URL(`/twirp/comic.v1.Comic/${path}`, this.URI);
        uri.search = new URLSearchParams({
            device: 'pc',
            platform: 'web',
            nov: '25'
        }).toString();

        const request = new Request(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Accept: 'application/json, text/plain, */*',
                Origin: this.URI.origin,
                'Content-Type': 'application/json;charset=UTF-8',
                Referer: uri.href,
            }
        });
        return FetchJSON<T>(request);
    }
}