import { Tags } from '../Tags';
import icon from './IkigaiMangas.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// TODO: Add Novel support

function CreateInfoExtractor(query: string) {
    return (anchor: HTMLAnchorElement) => ({
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>(query).innerText.trim(),
    });
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+\/$/, 'article figure > img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS('section ul.grid li > a', Common.PatternLinkGenerator('/series/?pagina={page}'), 0, CreateInfoExtractor('h3.font-semibold'))
@Common.ChaptersMultiPageCSS('ul li.w-full a', Common.PatternLinkGenerator('{id}?pagina={page}'), 0, CreateInfoExtractor('h3.card-title'))
@Common.PagesSinglePageCSS('section.container div.img img[alt*="Página"]') // FIXME
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikigaimangas', 'Ikigai Mangas', 'https://viralikigai.oxkdog.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        /*
        this.URI.href = await FetchWindowScript(new Request('https://ikigaimangas.com'), `new Promise(resolve => {
            window.open = (url, target) => resolve(url);
            document.querySelectorAll('div[' + CSS.escape('on:click') + ']').forEach(div => div.click());
        })`, 0);
        */
        this.URI.href = await FetchWindowScript(new Request('https://visualikigai.com'), `window.cookieStore.set('nsfw-mode', 'true'); window.location.origin;`, 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}