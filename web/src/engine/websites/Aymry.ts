import { Tags } from '../Tags';
import icon from './Aymry.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/book\/\d+\/$/, 'div.content h1.title')
@Common.MangasMultiPageCSS('ul.J_comicList li.acgn-item h3.acgn-title a', Common.PatternLinkGenerator('/lists/9/全部/3/${page}.html'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ol#j_chapter_list li a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#img-box img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aymry', 'Aymry', 'https://www.aymry.com', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}