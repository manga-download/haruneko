import { Tags } from '../Tags';
import icon from './Wurmz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/detail\/man(hu|hw|g)a\/[^/]+$/, 'ol.crumbs li:last-of-type span:not(.sep)')
@Common.MangasMultiPageCSS('article.comic-card a:has(.comic-title)', Common.PatternLinkGenerator('/semua-komik?page={page}'))
@Common.ChaptersSinglePageCSS('div.grid a.chap-cell', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.reader-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wurmmz', 'Wurmz', 'https://wurmz.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}