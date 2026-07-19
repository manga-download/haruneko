// https://en.inithtml.com/theme/init-manga/ WordPress Template

import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

export const queryMangas = 'div.manga-item-grid h2 a.uk-link-heading';
export const queryChapters = 'div.chapter-item a';

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('h3.uk-link-heading').innerText.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm').trim()
    };
}

@Common.MangaCSS(/^{origin}\/(seri|manga)\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/seri/page/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>(queryChapters, Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0, ChapterExtractor)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img')].map(img => img.dataset.originalSrc ?? img.src )`, 1500)
@Common.ImageAjax()
export class InitManga extends DecoratableMangaScraper { }