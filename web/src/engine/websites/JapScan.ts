import { Tags } from '../Tags';
import icon from './JapScan.webp';
import { DecoratableMangaScraper, type Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { ExtractPagesFromReader } from './JapScan.Extract';
import { DRMProvider } from './JapScan.DRM';

AddAntiScrapingDetection(async invoke => {
    // JapScan's own anti-bot (the "Glisse pour remettre dans l'ordre" puzzle) is announced by
    // `window.__captcha.needed === true` BEFORE its `#jc-overlay` node is rendered. Detect both so
    // the reader window is shown and the user can solve it; otherwise the page stays locked.
    const result = await invoke<boolean>(`!!document.querySelector('#jc-overlay') || (window.__captcha && window.__captcha.needed === true) || false;`);
    return result ? FetchRedirection.Interactive : undefined;
}, /^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}/);

@Common.MangaCSS<HTMLHeadingElement>(/^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}\/(manga|manhwa|bd)\/[^/]+\/$/, '#main div.card-body h1', (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/^man[gh][wu]?a\s+/i, '') }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('japscan', 'JapScan', 'https://www.japscan.foo', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return this.#drm.Initialize(this.URI);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.mangas-list div.manga-block a', Common.PatternLinkGenerator('/mangas/?p={page}'), 2500),
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.mangas-list div.manga-block a', Common.PatternLinkGenerator('/bds/?p={page}'), 2500),
        ];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.#drm.CreateChapterList(new URL(manga.Identifier, this.URI));
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const referer = new URL(chapter.Identifier, this.URI).href;
        const chapterURL = new URL(chapter.Identifier, this.URI);

        // Primary path: scroll the visible reader and collect CDN image URLs.
        // Fallback: DRM hook when the reader extraction returns empty.
        let pages = await ExtractPagesFromReader(referer);
        if (!pages.length) {
            try {
                pages = await this.#drm.CreateImageLinks(chapterURL);
            } catch {
                // DRM hook failed — no pages available
            }
        }
        return pages.map(link => new Page(this, chapter, new URL(link), { Referer: referer }));
    }
}
