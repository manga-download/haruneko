import { Tags } from '../Tags';
import icon from './AsmodeusScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';

// TODO : Novel Support

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePagesCSS([ KeyoApp.queryMangaPath ], KeyoApp.queryManga, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.pagesScript, 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asmodeusscans', 'Asmodeus Scans', 'https://asmotoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Novel, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}