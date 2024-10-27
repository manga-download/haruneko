import { Tags } from '../Tags';
import icon from './Oremanga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, ZManga.queryMangaTitle)
@Common.MangasSinglePageCSS('/manga-list-รายชื่อมังงะ/', ZManga.queryManga)
@Common.ChaptersSinglePageCSS(ZManga.queryChapters, Common.AnchorInfoExtractor(false, 'span.date'))
@Common.PagesSinglePageCSS('div.reader-area-main img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('oremanga', 'Oremanga', 'https://www.oremanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}