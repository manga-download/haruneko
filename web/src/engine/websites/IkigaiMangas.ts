import { Tags } from '../Tags';
import icon from './IkigaiMangas.webp';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// TODO: Add Novel support

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+\/$/, 'article figure > img', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('section ul.grid li > a', Common.PatternLinkGenerator('/series/?pagina={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLHeadingElement>('h3.font-semibold').innerText.trim()
}))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('ul li.w-full a', Common.PatternLinkGenerator('{id}?pagina={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLHeadingElement>('h3.card-title').innerText.trim()
}))
@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikigaimangas', 'Ikigai Mangas', 'https://visualikigai.cmpunjabrashancard.pk', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
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

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const response = await Fetch(new Request(new URL(chapter.Identifier, this.URI)));
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        return [...doc.querySelectorAll<HTMLImageElement>(`div[${CSS.escape('q:key')}] img.w-full[onload][onerror]:not([src*="bannerikigai"])`)].map(({ src }) =>
            new Page(this, chapter, new URL(src), { Referer: `${new URL(response.url).origin}/` }));
    }
}