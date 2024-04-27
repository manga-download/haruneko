import { Tags } from '../Tags';
import icon from './StarboundScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasSinglePageCSS('/series/', 'div#searched_series_page button a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapters a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#pages img:not(.hidden)')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('starboundscans', 'Starbound Scans', 'https://starboundscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}