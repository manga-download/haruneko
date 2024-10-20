import { Tags } from '../Tags';
import icon from './MaID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, ZManga.queryMangaTitle)
@Common.MangasSinglePageCSS(ZManga.queryMangaPath, ZManga.queryManga)
@Common.ChaptersSinglePageCSS(ZManga.queryChapters, Common.AnchorInfoExtractor(false, 'span.date'))
@Common.PagesSinglePageCSS(ZManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('maid', 'MAID', 'https://www.maid.my.id', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}