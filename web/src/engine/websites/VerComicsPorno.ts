import { Tags } from '../Tags';
import icon from './VerComicsPorno.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.content div.posts h1.titl')
@Common.MangasMultiPageCSS('/comics-porno/page/{page}', 'div.blog-list-items h2.information a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.wp-content p noscript img:not([src*="download.png"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vercomicsporno', `VerComicsPorno`, 'https://vercomicsporno.com', Tags.Media.Comic, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}