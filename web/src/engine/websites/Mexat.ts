import { Tags } from '../Tags';
import icon from './Mexat.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeProxify from '../transformers/ImageLinkDeProxifier';

@Common.MangaCSS(/^https?:\/\/manga\.mexat\.com\/category\/[^/]+\/$/, 'div.page-head h1.page-title')
@Common.MangasSinglePageCSS('/قائمة-المانجا/', 'div.content ul.MangaList li div.SeriesName a')
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
        return chapterslist;
    }

    async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const url = page == 1 ? new URL(manga.Identifier, this.URI) : new URL(`${manga.Identifier}page/${page}/`, this.URI);
        const request = new FetchRequest(url.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div#main-content div.content table tbody tr td:nth-of-type(2) a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS<HTMLOptionElement>(request, 'div.content div.manga-filter select#manga_pid option');
        return data.map(page => new Page(this, chapter, new URL(`${request.url}?pid=${page.value}`, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const image = await this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal
            });
            const realimage = new URL((await FetchCSS<HTMLImageElement>(request, 'div.content div.post-inner div.pic a img'))[0].src).pathname;
            return new Page(this, page.Parent as Chapter, new URL(DeProxify(new URL(realimage, page.Link.origin)).href));
        }, priority, signal);

        return await Common.FetchImageAjax.call(this, image, priority, signal, false);
    }
}