import { Tags } from '../Tags';
import icon from './MangaFreak.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS('/Mangalist/All/{page}', 'div.list_item div.list_item_info h3 a')
@Common.ChaptersSinglePageCSS('div.manga_series_list table tbody tr td:first-of-type a')
@Common.PagesSinglePageCSS('div.read_image div.mySlides img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafreak', `MangaFreak`, 'https://mangafreak.me', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/w+\d*.mangafreak.me\/Manga\/[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, 'div.manga_series_data h1');
    }
}