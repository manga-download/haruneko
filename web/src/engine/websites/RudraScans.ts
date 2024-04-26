import { Tags } from '../Tags';
import icon from './RudraScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\//, 'meta[property="og:image:alt"]')
@Common.MangasSinglePageCSS('/series', 'div.grid div#searched_series_page a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapters a.group', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#pages img.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rudrascans', 'Rudra Scans', 'https://rudrascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}