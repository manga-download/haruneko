import { Tags } from '../Tags';
import icon from './MangaRussia.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as TAADD from './decorators/TAADDBase';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html$/, 'div.mangabookbox div.bookmessagebox h1', TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, TAADD.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@TAADD.ChaptersSinglePageCSS('div.chapterlist table tr td.col1 a', TAADD.ChapterExtractor, false)
@TAADD.PagesSinglePageCSS()
@TAADD.ImageAjaxFromHTML()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangarussia', `MangaRussia`, 'https://www.mangarussia.com', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}