import { Tags } from '../Tags';
import icon from './YuraManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, ZManga.queryMangaTitle)
@Common.MangasMultiPageCSS('/page/{page}/', 'div.flexbox4 div.flexbox4-item div.flexbox4-content > a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(ZManga.queryChapters, Common.AnchorInfoExtractor(false, 'span.date'))
@Common.PagesSinglePageCSS(ZManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yuramanga', 'YuraManga', 'https://www.yuramanga.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
