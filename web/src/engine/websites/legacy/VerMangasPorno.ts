import { Tags } from '../../Tags';
import icon from './VerMangasPorno.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

//In theory it should work but website use Cloudflare
@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.content div.posts h1.titl')
@Common.MangasMultiPageCSS('/page/{page}', 'h2.information a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS('div.wp-content p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vermangasporno', `VerMangasPorno`, 'https://vermangasporno.com', Tags.Media.Manga, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}