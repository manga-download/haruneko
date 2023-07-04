import { Tags } from '../../Tags';
import icon from './WieManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as TAADD from '../decorators/TAADD';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/www\.wiemanga\.com\/manga\/\S+\.html$/, 'div.mangabookbox div.bookmessagebox h1', TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, TAADD.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@TAADD.ChaptersSinglePageCSS('div.chapterlist table tr td.col1 a', TAADD.ChapterExtractor, false)
@TAADD.PagesMultiPageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wiemanga', `WieManga`, 'https://www.wiemanga.com', Tags.Language.German, Tags.Media.Manga, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}