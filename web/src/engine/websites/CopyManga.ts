import { Tags } from '../Tags';
import icon from './CopyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Check, Choice, Text } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../i18n/ILocale';
import { FetchRequest } from '../FetchProviderNodeWebkit';
import { FetchJSON } from '../FetchProvider';

type APIResponse<T> = {
    code: number,
    message: string,
    results: T
}

type APISingleComic = {
    comic: APIComic
}

type APIResultList<T> = {
    list: T[]
}

type APIPages = {
    chapter: APIChapter
}

type APIComic = {
    uuid: string,
    path_word: string,
    name: string
}

type APIChapter = {
    uuid: string,
    name: string,
    contents: {
        url: string
    }[];
    words: number[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly API_HEADERS = {
        'User-Agent': '"User-Agent" to "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44"',
        version: new Date().toISOString().replace(/-/g, ".").split('T').shift(),
        platform: "1",
    };

    private readonly apiurl = 'https://api.copymanga.org';

    public constructor() {
        super('copymanga', 'CopyManga', 'https://www.copymanga.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);

        //URL
        this.Settings.url = new Text('urloverride', W.Plugin_Settings_UrlOverride, W.Plugin_Settings_UrlOverrideInfo, 'https://www.copymanga.site');
        this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        this.URI.href = this.Settings.url.value as string;

        //image format
        this.Settings.format = new Choice('image.format',
            W.Plugin_Settings_ImageFormat,
            W.Plugin_Settings_ImageFormatInfo,
            'jpeg',
            { key: 'jpeg', label: E.Settings_Global_DescramblingFormat_JPEG },
            { key: 'webp', label: E.Settings_Global_DescramblingFormat_WEBP },
        );

        //"Use Global CDN"
        this.Settings.useGlobalCDN = new Check(
            'check-useGlobalCDN',
            W.Plugin_CopyManga_Settings_GlobalCDN,
            W.Plugin_CopyManga_Settings_GlobalCDNInfo,
            true //true = 0, false = 1
        );

    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const request = this.createApiRequest(`api/v3/comic2/${id}`);
        const data = await FetchJSON<APIResponse<APISingleComic>>(request);
        return new Manga(this, provider, data.results.comic.path_word, data.results.comic.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {//its offset so page start at 0
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const request = this.createApiRequest(`/api/v3/comics?ordering=-datetime_updated&limit=50&offset=${page * 50}`); //50 is the max
            const data = await FetchJSON<APIResponse<APIResultList<APIComic>>>(request);
            return data.results.list.map(item => {
                return new Manga(this, provider, item.path_word, item.name.trim());
            });
        } catch (error) {
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async getChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        try {
            const request = this.createApiRequest(`/api/v3/comic/${manga.Identifier}/group/default/chapters?limit=500&offset=${page * 500}`);
            const data = await FetchJSON<APIResponse<APIResultList<APIChapter>>>(request);
            return data.results.list.map(item => {
                return new Chapter(this, manga, item.uuid, item.name.trim());
            });
        } catch (error) {
            return [];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = this.createApiRequest(`/api/v3/comic/${chapter.Parent.Identifier}/chapter2/${chapter.Identifier}?platform=3`);
        const data = await FetchJSON<APIResponse<APIPages>>(request);
        const imageUrls = data.results.chapter.contents.map(item => item.url);
        const imageOrder = data.results.chapter.words;
        const orderedPages : string[] = [];
        imageOrder.forEach((order, index) => {
            orderedPages[order] = imageUrls[index];
        });
        return orderedPages.map(page => new Page(this, chapter, new URL(page)));
    }

    private createApiRequest(pathname: string): FetchRequest {
        const request = new FetchRequest(new URL(pathname, this.apiurl).href);
        Object.keys(this.API_HEADERS).forEach(key => {
            request.headers.set(key, this.API_HEADERS[key]);
        });
        request.headers.set("Referer", this.URI.href);
        request.headers.set("webp", this.Settings.format.Value == 'jpeg' ? '0' : '1');
        request.headers.set("region", this.Settings.useGlobalCDN.Value ? '0' : '1');
        return request;
    }

}