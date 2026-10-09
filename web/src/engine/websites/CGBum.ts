import { Tags } from '../Tags';
import icon from './CGBum.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^\/]+$/, 'div.comic-info h1')
@Common.MangasMultiPageCSS('article.comic-card h3.comic-card-title a', Common.PatternLinkGenerator('/daftar-komik?page={page}'))
@Common.ChaptersSinglePageCSS('div.chapter-grid a')
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.page-container[data-url]')].map(page => page.dataset.url);`)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cgbum', 'CGBum', 'https://cgbum.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}