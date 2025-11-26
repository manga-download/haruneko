import { Tags } from '../Tags';
import icon from './JapScan.webp';
import { DecoratableMangaScraper, type Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './JapScan.DRM';

@Common.MangaCSS<HTMLHeadingElement>(/^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}\/(manga|manhwa|bd)\/[^/]+\/$/, '#main div.card-body h1', (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/^man[gh][wu]?a\s+/i, '') }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor() {
        super('japscan', 'JapScan', 'https://www.japscan.vip', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
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
        const pages = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return pages.map(link => new Page(this, chapter, new URL(link), { Referer: this.URI.href }));
    }
}