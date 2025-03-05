import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(FlatManga.pathManga, 'body title', (element: HTMLTitleElement) => element.text.split(' - ').at(0).trim())
@Common.MangasSinglePagesCSS([ '/manga-list.html' ], 'div.container a[data-toggle="mangapop"]:not([data-original-title=""])')
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatr', 'Manga-TR', 'https://manga-tr.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('read_type', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/cek/fetch_pages_manga.php?manga_cek={manga}', 'table.table tr td[align="left"] > a');
    }
}