import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/seri\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-block h3 a.uk-link-heading', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-item a', Common.PatternLinkGenerator('{id}/bolum/page/{page}/#chapter-list'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.uk-link-heading').innerText.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm') }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img[data-original-src]')].map(img => img.dataset.originalSrc);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('merlinscans', 'MerlinToon', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}