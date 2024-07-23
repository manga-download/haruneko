import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

@Common.MangaCSS(/^{origin}\/manga[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageAJAX('/app/manga/controllers/cont.Listchapterapi.php?slug=', 'sLugs', 'ul > a', Common.AnchorInfoExtractor(true))
@FlatManga.PagesSinglePageAJAX('/app/manga/controllers/cont.imgsList.php?cid=', 'img.chapter-img:not([alt*="nicoscan"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', `NicoManga`, 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}