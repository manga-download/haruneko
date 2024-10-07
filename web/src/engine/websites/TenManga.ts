import { Tags } from '../Tags';
import icon from './TenManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as TAADD from './decorators/TAADD';
import * as Common from './decorators/Common';
function ChapterExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.getElementsByClassName('chp-idx')[0].textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/book\/[^/]+\.html$/, TAADD.queryMangaTitleFromURI, TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, 'section.book-list div.book-item a:first-of-type', 1, 1, 0, Common.AnchorInfoExtractor(true))
@TAADD.ChaptersSinglePageCSS('div.chp-item a', ChapterExtractor)
@TAADD.PagesSinglePageCSS('div.option-list.chp-selection-list[option_name="page_head"] div[option_val]')
@TAADD.ImageAjaxFromHTML()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('tenmanga', `TenManga`, 'https://www.tenmanga.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}