import { Tags } from '../Tags';
import icon from './MangaHere.webp';
import { FetchRequest, FetchWindowScript } from '../FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as DM5 from './decorators/DM5';

const extractor = Common.AnchorInfoExtractor(true);
@Common.MangaCSS(/^{origin}\/manga\//, 'div.detail-info span.detail-info-right-title-font')
@Common.MangasSinglePageCSS('/mangalist/', 'div.browse-new-block-list div.browse-new-block p.browse-new-block-content a', extractor)
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a', extractor)
@DM5.PagesSinglePageScript()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper /* MangaFox */ {

    public constructor() {
        super('mangahere', 'MangaHere', 'https://www.mangahere.cc', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, `window.cookie.set('isAdult', '1')`);
    }

    public override get Icon() {
        return icon;
    }
}