import { Tags } from '../Tags';
import icon from './MeiToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePagesCSS([ KeyoApp.queryMangaPath ], KeyoApp.queryManga, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.PagesScript(), 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('meitoon', 'MeiToon', 'https://meitoon.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}