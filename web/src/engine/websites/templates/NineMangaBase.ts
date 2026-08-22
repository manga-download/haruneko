import { Fetch, FetchCSS } from '../../platform/FetchProvider';
import { type Manga, Chapter, Page, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';
import { GetTypedData } from '../decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
};

@Common.MangaCSS(/^{origin}\/(original|manga)\/[^/]+\.html/, 'h1.book-headline-name', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('div.manga-list td.manga-part > a', Common.PatternLinkGenerator('/search/?completed_series=either&page={page}'), 0, Common.AnchorInfoExtractor(true))
export class NineMangaBase extends DecoratableMangaScraper {

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier.replace(/\.html$/, '/chapters.html')}`, this.URI)), 'ul.chapter-list > a');
        return chapters.map(({ pathname, title }) => new Chapter(this, manga, pathname, title.replace(manga.Title, '').replace(/^\s*:/, '').trim() || title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const pages = await FetchCSS(this.CreateRequest(chapterUrl), 'div[option_name="page_head"] div.chp-selection-item');
        return pages.map(page => {
            const url = new URL(page.getAttribute('option_val'), this.URI);
            url.hostname = this.URI.hostname;
            return new Page(this, chapter, url, { Referer: chapterUrl.href });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {
            const realimage = (await FetchCSS<HTMLImageElement>(this.CreateRequest(page.Link), 'img.manga_pic')).at(0).getAttribute('src');
            const response = await Fetch(new Request(realimage, {
                signal,
                headers: {
                    Referer: page.Parameters.Referer
                }
            }));
            return GetTypedData(await response.arrayBuffer());
        }, priority, signal);
    }

    private CreateRequest(url: URL, signal: AbortSignal = undefined): Request {
        return new Request(url, {
            signal,
            headers: {
                'Referer': undefined //no referer is mandatory to bypass website protection
            }
        });
    }
}