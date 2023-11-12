import { Tags } from '../../Tags';
import icon from './TruyenTranhtuan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div#infor-box div h1[itemprop="name"]')
@Common.MangasSinglePageCSS('/danh-sach-category', 'div.manga-focus span.manga a')
@Common.ChaptersSinglePageCSS('div#manga-chapter span.chapter-name a')
@Common.PagesSinglePageJS('slides_page')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('truyentranhtuan', `TruyenTranhtuan`, 'https://truyentuan.com', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }
    public override get Icon() {
        return icon;
    }
}