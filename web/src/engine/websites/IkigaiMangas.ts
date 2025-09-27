import { Tags } from '../Tags';
import icon from './IkigaiMangas.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// TODO: Add Novel support
function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('h3.font-semibold').innerText.trim()
    };
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+\/$/, 'article figure > img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS('section ul.grid li > a', Common.PatternLinkGenerator('/series/?pagina={page}'), 0, MangaInfoExtractor)
@Common.ChaptersMultiPageCSS('ul li.w-full a', Common.PatternLinkGenerator('{id}?pagina={page}'), 0,
    (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('h3.card-title').innerText.trim() }))
@Common.PagesSinglePageCSS('div.img img[alt*="Página"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikigaimangas', 'Ikigai Mangas', 'https://visualikigai.riccineer.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request('https://visualikigai.com'), `window.cookieStore.set('nsfw-mode', 'true');window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}