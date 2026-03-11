import { Tags } from '../Tags';
import icon from './MangaFire.webp';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

import { DRMProvider } from './MangaFire.DRM.js';

type PageParameters = {
    ScramblingOffset?: number;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.info h1[itemprop="name"]', (head, uri) => ({ id: uri.pathname, title: head.innerText.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.info > a', Common.PatternLinkGenerator('/az-list?page={page}'), 250, anchor => ({ id: anchor.pathname.split('.').at(-1), title: anchor.text.trim() }))
export default class extends DecoratableMangaScraper {

    #drm = new DRMProvider();

    public constructor() {
        super('mangafire', 'MangaFire', 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const parser = new DOMParser();
        const id = manga.Identifier.split('.').at(-1);
        return Array.fromAsync(async function* () {
            for (const type of ['chapter', 'volume']) {
                for (const language of ['en', 'es', 'es-la', 'fr', 'ja', 'pt-br']) {
                    const uri = new URL(`/ajax/manga/${id}/${type}/${language}`, this.URI);
                    const { result } = await FetchJSON<{ result: string }>(new Request(uri));
                    const entries = [...parser.parseFromString(result, 'text/html').documentElement.querySelectorAll<HTMLSpanElement>('.item[data-number] > a > span:first-of-type')];
                    yield* entries.map(span => new Chapter(this, manga, span.closest('a').pathname, `${span.innerText.trim()} (${language})`));
                }
            }
        }.call(this));
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