import { type Tag } from '../../Tags';
import { Choice } from '../../SettingsManager';
import { EngineResourceKey as E, WebsiteResourceKey as W } from '../../../i18n/ILocale';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { FetchCSS, FetchJSON, FetchRequest } from '../../FetchProvider';

export type MHXK_infos = {
    id: string,
    name: string,
    platform: string
}

type APIResult<T> = {
    data: T,
    status: number,
    message: string;
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

export default class extends DecoratableMangaScraper {
    protected product: MHXK_infos;

    public constructor(id: string, title: string, url: string, product: MHXK_infos, ...tags: Tag[]) {
        super(id, title, url, ...tags);
        this.product = product;

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

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [data] = await FetchCSS(new FetchRequest(url), '[data-comic-id], [data-comic_id]');
        const id: string = data.dataset.comicId || data.dataset.comic_id;
        const title = data.textContent.trim();
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = this.createCustomerURI('/getComicList/');
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new FetchRequest(uri.href));
        return data.map(manga => new Manga(this, provider, manga.comic_id.toString(), manga.comic_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = this.createCustomerURI('/getComicInfoBody/');
        uri.searchParams.set('comic_id', manga.Identifier);
        const { data } = await FetchJSON<APIResult<APIManga>>(new FetchRequest(uri.href));
        return data.comic_chapter.map(chapter => new Chapter(this, manga, chapter.chapter_newid, chapter.chapter_name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = this.createCustomerURI('/getchapterinfov2');
        uri.search = new URLSearchParams({
            product_id: this.product.id,
            productname: this.product.name,
            platformname: this.product.platform,
            comic_id: chapter.Parent.Identifier,
            chapter_newid: chapter.Identifier,
            isWebp: this.Settings.format.Value as string,
            quality: this.Settings.quality.Value as string
        }).toString();
        const { data } = await FetchJSON<APIResult<APIManga>>(new FetchRequest(uri.href));
        return data.current_chapter.chapter_img_list.map(page => new Page(this, chapter, new URL(page)));
    }

    createCustomerURI(endpoint: string) {
        return new URL('/api' + endpoint, this.URI);
    }

}
