import { Tags } from '../Tags';
import icon from './CrunchyScan.webp';
import type { Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './CrunchyScan.DRM';

const ExtractTitle = (element: HTMLElement) => element.innerText.replace(/^\s*\(\s*adulte[^\)]*\)\s*/i, '');

@Common.MangaCSS(/^{origin}\/lecture-en-ligne\/[^/]+$/, 'main.container .baseManga h2', ExtractTitle)
@Common.MangasMultiPageCSS('a[class*="text"][href*="/lecture-en-ligne/"]', Common.PatternLinkGenerator('/api/getLastManga?method=grid&page={page}'), 0, (a: HTMLAnchorElement) => ({ id: a.pathname, title: ExtractTitle(a) }))
@Common.ChaptersSinglePageCSS('#ChapterWrap a.chapter-link[href*="/read/"]')
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('crunchyscan', 'Crunchyscan', 'https://crunchyscan.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(2, 1);
    }

    public override get Icon(): string {
        return icon;
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        // TODO: Enable when implementation is complete ...
        const data = new Array(-1); // await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return data.map(image => new Page(this, chapter, new URL(image.url, this.URI), { Referer: image.referer }));
    }

    public async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(() => this.#drm.GetImageData(page.Link, page.Parameters.Referer, signal), priority, signal);
    }
}