import { Tags } from '../Tags';
import icon from './JapScan.webp';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './JapScan.DRM';

@Common.MangaCSS(/^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}\/man(g|hw)a\/[^/]+\/$/, '#main div.card-body h1', element => element.textContent.replace(/^man[gh][wu]?a\s+/i, ''))
@Common.MangasMultiPageCSS('/mangas/?p={page}', 'div.mangas-list div.manga-block a', 1, 1, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    public constructor () {
        super('japscan', 'JapScan', 'https://www.japscan.si', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return this.#drm.Initialize(this.URI);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.#drm.CreateChapterList(new URL(manga.Identifier, this.URI));
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return pages.map(link => new Page(this, chapter, new URL(link), { Referer: this.URI.href }));
    }
}