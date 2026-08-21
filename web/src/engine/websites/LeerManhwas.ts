import { Tags } from '../Tags';
import icon from './LeerManhwas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// NOTE: The chapter anchor contains an update badge (either a `NEW` image or the release date)
//       next to the chapter name, which must be dropped to get a clean chapter title.
const chapterInfoExtractor = Common.AnchorInfoExtractor(false, 'span.ct-update');

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+\/$/, 'h1.main-info-title')
@Common.MangasMultiPageCSS('div.latest-item div.mm-name a', Common.PatternLinkGenerator('/page/{page}/'))
@Common.ChaptersSinglePageCSS('ul.chapter-list a.leermos', undefined, chapterInfoExtractor)
@Common.PagesSinglePageCSS('div.reading-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leermanhwas', 'LeerManhwas', 'https://leermanhwas.com', Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
