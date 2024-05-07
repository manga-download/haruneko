import { Tags } from '../Tags';
import icon from './Toti.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor( anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').trim()
    };
}

function MangaLabelExtractor(image: HTMLImageElement) {
    return image.getAttribute('alt').trim();
}

function PageExtractor(element: HTMLSpanElement) {
    return element.getAttribute('img-url').trim();
}

@Common.MangaCSS(/^{origin}\/product\/[^/]+$/, 'p.cover img', MangaLabelExtractor)
@Common.MangasSinglePageCSS('/product', 'div.cards_wrap article a', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.episode ul li a')
@Common.PagesSinglePageCSS('#viewer.manga div.manga_page:not(.info_page) span.manga_page_image', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toti', 'To-Ti', 'https://to-ti.in', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}