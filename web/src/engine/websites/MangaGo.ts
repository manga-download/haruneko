import { Tags } from '../Tags';
import icon from './MangaGo.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import DeScramble from '../transformers/ImageDescrambler';
import * as Common from './decorators/Common';
import { DRMProvider } from './MangaGo.DRM';

@Common.MangaCSS(/^{origin}\/read-manga\/[^/]+\/$/, 'div#page div.people-panel div.w-title h1')
@Common.MangasMultiPageCSS('/genre/all/{page}/', 'div.pic_list span.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor () {
        super('mangago', 'MangaGo', 'https://www.mangago.me', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.#drm.CreateChapterList(this.URI, new URL(manga.Identifier, this.URI));
        return data.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return data.map(link => new Page(this, chapter, new URL(link, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        page.Link.href = await this.#drm.CreateImageLink(page.Link);
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !/cspiclink/.test(page.Link.href) ? blob : DeScramble(blob, async (image, ctx) => this.#drm.DescrambleImage(page.Link.href, image, ctx));
    }
}