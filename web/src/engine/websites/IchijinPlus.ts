import { Tags } from '../Tags';
import icon from './IchijinPlus.webp';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/series', 'div[class*="Series_series"] a[data-gtm="series-series-thumbnail"]',
    anchor => ({ id: anchor.pathname, title: anchor.dataset.seriesName.trim() }))
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