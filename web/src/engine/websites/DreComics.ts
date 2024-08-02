import { Tags } from '../Tags';
import icon from './DreComics.webp';
import { DecoratableMangaScraper} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ClipStudioReader from './decorators/ClipStudioReader';

@Common.MangaCSS(/^{origin}\/drecomics\/series\/[^/]+$/, 'div.detailComics h1.detailComics_title > span')
@Common.MangasSinglePageCSS('/drecomics/series', 'div.seriesList li.seriesList__item a.seriesList__link')
@Common.ChaptersSinglePageCSS('div.ebookListItem a.ebookListItem_title')
@ClipStudioReader.PagesSinglePageAJAX()
@ClipStudioReader.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drecomics', 'DRE Comics', 'https://drecom-media.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
