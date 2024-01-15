import { Tags } from '../Tags';
import icon from './CopyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Check, Choice } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../i18n/ILocale';
import { FetchJSON } from '../platform/FetchProvider';

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
    private get Apidate() { return new Date().toISOString().replace(/-/g, ".").split('T').shift(); }

    private readonly apiurl = 'https://api.copymanga.org';

    public constructor() {
        super('copymanga', 'CopyManga', 'https://www.copymanga.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);

        //this.Settings.url = new Text('urloverride', W.Plugin_Settings_UrlOverride, W.Plugin_Settings_UrlOverrideInfo, this.URI.href);
        //this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;

        this.Settings.format = new Choice('image.format',
            W.Plugin_Settings_ImageFormat,
            W.Plugin_Settings_ImageFormatInfo,
            'jpeg',
            { key: 'jpeg', label: E.Settings_Global_Format_JPEG },
            { key: 'webp', label: E.Settings_Global_Format_WEBP },
        );

        this.Settings.useGlobalCDN = new Check(
            'check-useGlobalCDN',
            W.Plugin_CopyManga_Settings_GlobalCDN,
            W.Plugin_CopyManga_Settings_GlobalCDNInfo,
            true
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
        const request = this.createApiRequest(`comic2/${id}`);
        const data = await FetchJSON<APIResponse<APISingleComic>>(request);
        return new Manga(this, provider, data.results.comic.path_word, data.results.comic.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const request = this.createApiRequest(`comics?ordering=-datetime_updated&limit=50&offset=${page * 50}`);
            const data = await FetchJSON<APIResponse<APIResultList<APIComic>>>(request);
            return data.results.list.map(item => new Manga(this, provider, item.path_word, item.name.trim()));
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
            const request = this.createApiRequest(`comic/${manga.Identifier}/group/default/chapters?limit=500&offset=${page * 500}`);
            const data = await FetchJSON<APIResponse<APIResultList<APIChapter>>>(request);
            return data.results.list.map(item => new Chapter(this, manga, item.uuid, item.name.trim()));
        } catch (error) {
            return [];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = this.createApiRequest(`comic/${chapter.Parent.Identifier}/chapter2/${chapter.Identifier}?platform=3`);
        const data = await FetchJSON<APIResponse<APIPages>>(request);
        const imageUrls = data.results.chapter.contents.map(item => item.url);
        const imageOrder = data.results.chapter.words;
        const orderedPages : string[] = [];
        imageOrder.forEach((order, index) => {
            orderedPages[order] = imageUrls[index];
        });
        return orderedPages.map(page => new Page(this, chapter, new URL(page)));
    }

    private createApiRequest(pathname: string): Request {
        const request = new Request(new URL(`/api/v3/${pathname}`, this.apiurl).href,
            {
                headers: {
                    Version: this.Apidate,
                    Platform: '1',
                    Referer: this.URI.href,
                    Region: this.Settings.useGlobalCDN.Value ? '0' : '1',
                    WebP: this.Settings.format.Value == 'webp' ? '1' : '0',
                }
            });

        return request;
    }

}