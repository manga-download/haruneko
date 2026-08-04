import { Tags } from '../Tags';
import icon from './FalcoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comics\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({ id: uri.pathname, title: meta.content.split('|').at(0).trim() }))
@Common.MangasSinglePageCSS('/comics', 'div.col-xxl-9 div.row a[href*="/comics/"]', element => ({
    id: new URL(element.getAttribute('onclick').match(/location\.href\s*=\s*['"]([^'"]+)/).at(1)).pathname,
    title: element.querySelector<HTMLSpanElement>('div div span.color-white.d-block').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.specmobile div[onclick]', undefined, element => ({
    id: new URL(element.getAttribute('onclick').match(/location\.href\s*=\s*['"]([^'"]+)/)[1]).pathname,
    title: element.querySelector<HTMLSpanElement>('div div span.color-white.d-block').textContent.trim()
}))
@Common.PagesSinglePageJS(`
    [... document.querySelectorAll('div#canvas-reader canvas')].map( canvas => {
        return new URL(atob(canvas.dataset.src.match(/\\/img-serve\\/([^/]+)/).at(-1)), window.location.origin).href
    })
`)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tenkai', 'Falco Scan', 'https://falcoscan.net', Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}