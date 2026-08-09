import { Tags } from '../Tags';
import icon from './Toti.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/product\/[^/]+$/, 'p.cover img', (img, uri) => ({
    id: uri.pathname,
    title: img.getAttribute('alt').trim(),
}))
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/product', 'div.cards_wrap article a', anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').getAttribute('alt').trim()
}))
@Common.ChaptersSinglePageCSS('div.episode ul li a')
@Common.PagesSinglePageCSS('#viewer.manga div.manga_page:not(.info_page) span.manga_page_image', element => element.getAttribute('img-url').trim())
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toti', 'To-Ti', 'https://to-ti.in', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}