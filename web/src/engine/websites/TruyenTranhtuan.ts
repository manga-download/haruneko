import { Tags } from '../Tags';
import icon from './TruyenTranhtuan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div#infor-box h1[itemprop="name"]')
@Common.MangasSinglePageCSS('/danh-sach-category', 'span.manga > a')
@Common.ChaptersSinglePageCSS('div#manga-chapter span.chapter-name > a')
@Common.PagesSinglePageJS('slides_page', 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhtuan', 'TruyenTranhtuan', 'https://truyentuan.xyz', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}