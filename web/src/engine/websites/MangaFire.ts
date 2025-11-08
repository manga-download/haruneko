import { type Tag, Tags } from '../Tags';
import icon from './MangaFire.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

import { DRMProvider } from './MangaFire.DRM.js';

type PageParameters = {
    ScramblingOffset?: number;
};

function ChapterInfoExtractor(span: HTMLSpanElement) {
    const pathname = span.closest('a').pathname;
    console.log(pathname);
    const language = pathname.split('/').at(-2);
    return {
        id: pathname,
        title: `${span.innerText.trim()} (${language})`,
    }
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.info h1[itemprop="name"]', (head, uri) => ({ id: uri.pathname, title: head.innerText.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.info > a', Common.PatternLinkGenerator('/az-list?page={page}'), 250, anchor => ({ id: anchor.pathname.split('.').at(-1), title: anchor.text.trim() }))
@Common.ChaptersSinglePageCSS('section.m-list ul li.item[data-number] > a > span:first-of-type', undefined, ChapterInfoExtractor)
export default class extends DecoratableMangaScraper {

    #drm = new DRMProvider();

    public constructor() {
        super('mangafire', 'MangaFire', 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const images = await this.#drm.CreateImageLinks(uri);
        return images.map(([link, _, offset]) => new Page(this, chapter, new URL(link), { Referer: uri.href, ScramblingOffset: offset }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters.ScramblingOffset ? DeScramble(blob, (source, target) => this.#drm.DescrambleImage(page.Parameters.ScramblingOffset, source, target)) : blob;
    }
}