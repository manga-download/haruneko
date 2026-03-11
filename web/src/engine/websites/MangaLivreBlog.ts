import { Tags } from '../Tags';
import icon from './MangaLivreBlog.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.manga-info h1.manga-title', Common.WebsiteInfoExtractor({ queryBloat: 'img' }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('article a', Common.PatternLinkGenerator('/manga/page/{page}/'), 0, anchor => ({
    id: anchor.pathname, title: anchor.querySelector('.manga-card-title').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('a.chapter-link', undefined, Common.AnchorInfoExtractor(false, ':not(.chapter-number)'))
@Common.PagesSinglePageCSS('div.chapter-images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalivreblog', 'MangaLivre (.blog)', 'https://mangalivre.blog', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}