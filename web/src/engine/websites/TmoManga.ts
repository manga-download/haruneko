import { Tags } from '../Tags';
import icon from './TmoManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// Madara?
@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga_biblioteca a[title]', Common.PatternLinkGenerator('/biblioteca?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul li.wp-manga-chapter > a')
@Common.PagesSinglePageCSS('div.reading-content div#images_chapter img.img-fluid.lazyload')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tmomanga', 'TmoManga', 'https://tmomanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}