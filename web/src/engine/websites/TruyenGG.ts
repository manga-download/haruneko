import { Tags } from '../Tags';
import icon from './TruyenGG.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+-\d+\.html$/, 'div.title_tale h1[itemprop="name"]')
@Common.MangasMultiPageCSS('/truyen-moi-cap-nhat/trang-{page}.html', 'div.list_item_home div a.book_name', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.list_chap li.item_chap a')
@Common.PagesSinglePageCSS('div.content_detail_manga img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyengg', 'TruyenGG', 'https://truyengg.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}