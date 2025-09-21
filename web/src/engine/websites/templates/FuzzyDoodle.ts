import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'section img.object-cover', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('div#card-real a', Common.PatternLinkGenerator('/manga?page={page}'), 0, MangaInfoExtractor)
@Common.ChaptersMultiPageCSS('div#chapters-list a', Common.PatternLinkGenerator('{id}?page={page}'), 0,
    (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector('span').innerText.trim() }))
@Common.PagesSinglePageCSS('div#chapter-container img.chapter-image')
@Common.ImageAjax()
export class FuzzyDoodle extends DecoratableMangaScraper { }