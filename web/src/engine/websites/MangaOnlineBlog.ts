import { Tags } from '../Tags';
import icon from './MangaOnlineBlog.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.manga-title')
@Common.MangasMultiPageCSS('article.home-manga-card div.home-card-body h3 a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersSinglePageCSS('div.chapters-grid a.chapter-grid-number')
@Common.PagesSinglePageCSS('div.chapter-images img.chapter-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaonlineblog', 'Manga Online Blog', 'https://mangaonline.love', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}