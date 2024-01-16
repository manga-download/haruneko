import { Tags } from '../Tags';
import icon from './Mexat.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/category\/[^/]+\/$/, 'div.page-head h1.page-title')
@Common.MangasSinglePageCSS('/قائمة-المانجا/', 'div.content ul.MangaList li div.SeriesName a')
@Common.ImageAjaxFromHTML('div.content div.post-inner div.pic a img')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mexat', `مانجا مكسات (Mexat)`, 'https://manga.mexat.com', Tags.Language.Arabic, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist.distinct();
    }

    async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const url = page == 1 ? new URL(manga.Identifier, this.URI) : new URL(`${manga.Identifier}page/${page}/`, this.URI);
        const request = new Request(url.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div#main-content div.content table tbody tr td:nth-of-type(2) a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS<HTMLOptionElement>(request, 'div.content div.manga-filter select#manga_pid option');
        return data.map(page => new Page(this, chapter, new URL(`${request.url}?pid=${page.value}`, this.URI)));
    }

}