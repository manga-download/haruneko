import { Tags } from '../Tags';
import icon from './LeituraManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav#breadcrumb ol li:last-of-type')
@Common.MangasMultiPageCSS('section#other-pages div.grid a:has(img)', Common.PatternLinkGenerator('/latest?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div.grid div.grid a[href*="/chapter"]')].map(e => ({ id: e.pathname, title : e.text.trim()}));`, 1500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-image-list img')].map(img => img.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leituramanga', 'LeituraManga', 'https://leituramanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}