import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-block h3 a.uk-link-heading', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersMultiPageCSS('div.chapter-item a', 1, 1, 0,
    Common.PatternLinkResolver('{id}chapter/page/{page}/'),
    (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.uk-link-heading').innerText.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm') }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img[data-original-src]')].map(img => img.dataset.originalSrc);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('merlinscans', 'Merlin Scans', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}