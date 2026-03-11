import { Tags } from '../Tags';
import icon from './ShonenJumpRookie.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchHTML } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.series-title-container h1.series-title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul#episode-list li a.episode-content', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.episode-title').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.image-container p.page-area img.js-page-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumprookie', `ジャンプルーキー (Jump Rookie)`, 'https://rookie.shonenjump.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const doc = await FetchHTML(new Request(this.URI));
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            const extract = (dom: Document, firstPage: boolean) => {
                const selector = firstPage
                    ? 'section#popular-series ol.series-box-list li section.series-contents a'
                    : 'li section.series-contents a'; // different selector for paginated pages
                return [...dom.querySelectorAll<HTMLAnchorElement>(selector)]
                    .map(manga => new Manga(this, provider, manga.pathname, (manga.querySelector('h1.series-title')?.textContent ?? manga.title).trim()));
            };

            yield* extract(doc, true);

            for (let cursor = doc.querySelector<HTMLOListElement>('ol[data-series-read-more-url]')?.dataset.seriesReadMoreUrl; cursor;) {
                const response = await Fetch(new Request(new URL(cursor, this.URI), {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                }));
                const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
                yield* extract(dom, false);
                cursor = response.headers.get('tky-link-rel-next');
            }
        }.call(this));
    }
}