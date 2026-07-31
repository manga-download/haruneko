import { Tags } from '../Tags';
import icon from './RawInu.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { queryMangaTitle, queryMangas, MangasLinkGenerator, queryPages, FetchChaptersAJAX, queryChapters, AnchorExtractor, ClipBoardExtractor } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, queryMangaTitle, ClipBoardExtractor)
@Common.MangasMultiPageCSS(queryMangas, MangasLinkGenerator, 0, AnchorExtractor)
@Common.PagesSinglePageCSS(queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawinu', 'RawInu', 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        `);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?slug={manga}', queryChapters);
    }
}