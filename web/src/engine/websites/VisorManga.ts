import { Tags } from '../Tags';
import icon from './VisorManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.last-mangas-content div.image-post a', Common.PatternLinkGenerator('/biblioteca?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('li.li-manga-chapter a')
@Common.PagesSinglePageCSS('#image-alls img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('visormanga', 'Visor Manga', 'https://visormanga.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}