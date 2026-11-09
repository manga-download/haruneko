import { Tags } from '../Tags';
import icon from './TimelessToons.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as KeyoApp from './templates/KeyoApp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePageCSS(KeyoApp.queryMangaPath, 'div#searched_series_page button > a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.PagesScript('https://cdn.meowing.org/uploads/'), 750)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('timelesstoons', 'Timeless Toons', 'https://timelesstoons.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}