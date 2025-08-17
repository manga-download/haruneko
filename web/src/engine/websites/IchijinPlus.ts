import { Tags } from '../Tags';
import icon from './IchijinPlus.webp';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.dataset.seriesName.trim()
    };
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS(['/series'], 'div[class*="Series_series"] a[data-gtm="series-series-thumbnail"]', MangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ichijin-plus', '一迅プラス (Ichijin Plus)', 'https://ichicomi.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}