import { Tags } from '../Tags';
import icon from './TenManga.webp';
import * as Common from './decorators/Common';
import { MangaLabelExtractor, TAADBase, mangaPath } from './templates/TAADDBase';

@Common.MangaCSS(/^{origin}\/book\/[^/]+\.html$/, 'meta[property="og:title"]', MangaLabelExtractor)
@Common.MangasMultiPageCSS(mangaPath, 'section.book-list div.book-item a:first-of-type', 1, 1, 0, Common.AnchorInfoExtractor(true))

export default class extends TAADBase {
    public constructor() {
        super('tenmanga', `TenManga`, 'https://www.tenmanga.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
        this.queryChapters = 'div.chp-item a';
        this.queryPages = 'div.option-list.chp-selection-list[option_name="page_head"] div[option_val]';
        this.forcedWebpCookieValue = undefined;
    }
    public override get Icon() {
        return icon;
    }
}