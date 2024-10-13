import { Tags } from '../Tags';
import icon from './ArvenScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePageCSS(KeyoApp.queryMangaPath, KeyoApp.queryManga, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.pagesScript, 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arvenscans', 'Arven Scans', 'https://arvencomics.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}