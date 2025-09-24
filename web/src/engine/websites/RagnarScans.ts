import { Tags } from '../Tags';
import icon from './RagnarScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-block h3 a.uk-link-heading', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersMultiPageCSS('div.chapter-item a', Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0,
    (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.uk-link-heading').innerText.trim().match(/^Bölüm[^:]+/).at(0).trim() }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img')].map(img => img.src);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ragnarscans', 'Ragnar Scans', 'https://ragnarscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}