// https://en.inithtml.com/theme/init-manga/ WordPress Template

import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^{origin}\/seri\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-item-grid h2 a.uk-link-heading', Common.PatternLinkGenerator('/seri/page/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-item a', Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.uk-link-heading').innerText.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm').trim() }))
@Common.ChapterURL()
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img')].map(img => img.dataset.originalSrc ?? img.src )`, 1500)
@Common.ImageAjax()
export class InitManga extends DecoratableMangaScraper { }