import { Tags } from '../Tags';
import icon from './FoxTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+-\d+\.html$/, 'h1.fx-info__title')
@Common.MangasMultiPageCSS('div.list_item_home div a.book_name', Common.PatternLinkGenerator('/truyen-moi-cap-nhat/trang-{page}.html'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.fx-chap-list li.fx-chap-item a')
@Common.PagesSinglePageCSS('div.content_detail_manga img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyengg', 'FoxTruyen', 'https://foxtruyen2.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}