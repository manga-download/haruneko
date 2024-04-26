import { Tags } from '../Tags';
import icon from './Chochox.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div.content div.posts h1.titl')
@Common.MangasMultiPageCSS('/porno/page/{page}/', 'h2.information a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.wp-content figure img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('chochox', `Chochox`, 'https://chochox.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}