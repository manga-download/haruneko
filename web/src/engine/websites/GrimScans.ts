import { Tags } from '../Tags';
import icon from './GrimScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePagesCSS([ KeyoApp.queryMangaPath ], KeyoApp.queryManga, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.PagesScript(), 1500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('grimscans', 'Grim Scans', 'https://grimscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}