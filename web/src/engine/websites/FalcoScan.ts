import { Tags } from '../Tags';
import icon from './FalcoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'div.series-main h1')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/comics', 'div.list-grid a.falco-card', anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.info h4').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.chapter-card', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.ch-name').textContent.trim()
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