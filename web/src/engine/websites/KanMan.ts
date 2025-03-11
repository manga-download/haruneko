import { Tags } from '../Tags';
import icon from './KanMan.webp';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Choice } from '../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../i18n/ILocale';

type APIResult<T> = {
    data: T,
}

type APIManga = {
    comic_id: number,
    comic_name: string
    comic_chapter: APIChapter[]
    current_chapter: APIChapter
}

type APIChapter = {
    chapter_name: string,
    chapter_newid: string
    chapter_img_list: string[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://www.kanman.com/api/';

    public constructor() {
        super('kanman', `看漫画 (KanMan)`, 'https://www.kanman.com', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);

        this.Settings.format = new Choice('image.format',
            W.Plugin_Settings_ImageFormat,
            W.Plugin_Settings_ImageFormatInfo,
            '1',
            { key: '0', label: E.Settings_Global_Format_JPEG },
            { key: '1', label: E.Settings_Global_Format_WEBP },
        );

        this.Settings.quality = new Choice('image.quality',
            W.Plugin_Settings_ImageQuality,
            W.Plugin_Settings_ImageQualityInfo,
            'high',
            { key: 'high', label: W.Plugin_Settings_ImageQuality_High },
            { key: 'middle', label: W.Plugin_Settings_ImageQuality_Medium },
            { key: 'low', label: W.Plugin_Settings_ImageQuality_Low },
        );
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [data] = await FetchCSS(new Request(url), 'h1.title');
        return new Manga(this, provider, url.match(/(\d+)\/$/)[1], data.textContent.trim());
    }
    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+/$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('./getComicList', this.apiUrl)));
        return data.map(manga => new Manga(this, provider, manga.comic_id.toString(), manga.comic_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./getComicInfoBody?comic_id=${manga.Identifier}`, this.apiUrl);
        const { data: { comic_chapter } } = await FetchJSON<APIResult<APIManga>>(new Request(uri));
        return comic_chapter.map(chapter => new Chapter(this, manga, chapter.chapter_newid, chapter.chapter_name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('./getchapterinfov2', this.apiUrl);
        uri.search = new URLSearchParams({
            product_id: '1',
            productname: 'kmh',
            platformname: 'pc',
            comic_id: chapter.Parent.Identifier,
            chapter_newid: chapter.Identifier,
            isWebp: this.Settings.format.Value as string,
            quality: this.Settings.quality.Value as string
        }).toString();
        const { data: { current_chapter: { chapter_img_list } } } = await FetchJSON<APIResult<APIManga>>(new Request(uri));
        return chapter_img_list.map(page => new Page(this, chapter, new URL(page)));
    }
}