import { Tags } from '../Tags';
import icon from './Grimelek.webp';
import { Chapter, type Manga, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.uk-grid-margin a.uk-link-heading', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#chapter-content img')].map(img => img.dataset.originalSrc ?? img.src )`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('grimelek', 'Grimelek', 'https://siyahmelek.lol', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}bolum/page/${page}/`, this.URI)), 'div#chapter-list div.chapter-item a.uk-link-toggle');
                const chapters = elements.map(anchor => {
                    const title = anchor.querySelector<HTMLHeadingElement>('h3').textContent.trim();
                    return new Chapter(this, manga, anchor.pathname, title.replace(manga.Title, '').replace(/^\s*–\s*/, '') || title);
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }

        }.call(this));
    }
}