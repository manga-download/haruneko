import { Tags } from '../Tags';
import icon from './MangaSefiri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.series-info-basic h1.series-name')
@Common.MangasSinglePageCSS('/serilerimiz', 'div.project a.series-name')
@Common.ChaptersSinglePageCSS('div#chapters a.chapter-item', Common.AnchorInfoExtractor(false, 'span'))
@Common.PagesSinglePageCSS('div.chapter-images img.img-responsive')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasefiri', 'Manga Sefiri', 'https://mangasefiri.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}