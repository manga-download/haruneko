import { Tags } from '../Tags';
import icon from './ComicGardo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/(episode|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS(['/series'], 'div.series ul.series-section-list li.series-section-item a.series-section-item-link', CoreView.DefaultMangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicgardo', 'コミックガルド (Comic Gardo)', 'https://comic-gardo.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}