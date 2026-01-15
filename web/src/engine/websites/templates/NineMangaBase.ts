import { Fetch, FetchCSS } from '../../platform/FetchProvider';
import { type Manga, type Chapter, Page, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';
import { GetTypedData } from '../decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
};

function ChapterLinkResolver(this: DecoratableMangaScraper, manga: Manga) {
    return new URL(`${manga.Identifier}?waring=1`, this.URI);
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html/, 'div.manga div.ttline h1', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('dl.bookinfo a.bookname', Common.PatternLinkGenerator('/search/?completed_series=either&page={page}'))
@Common.ChaptersSinglePageCSS('div.chapterbox ul li a.chapter_list_a', ChapterLinkResolver, Common.AnchorInfoExtractor(true))
export class NineMangaBase extends DecoratableMangaScraper {

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const data = await FetchCSS<HTMLOptionElement>(this.CreateRequest(chapterUrl), 'select#page option');
        //There may be MORE than one page list element on the page, we need only one ! In case of direct picture links, doesnt matter
        const subpages = Array.from(new Set([...data.map(element => new URL(element.value, this.URI).href)]));
        return subpages.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: chapterUrl.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {
            let request = this.CreateRequest(page.Link, signal);
            const realimage = (await FetchCSS<HTMLImageElement>(request, 'img.manga_pic')).at(0).getAttribute('src');
            request = new Request(realimage, {
                signal,
                headers: {
                    Referer: page.Parameters.Referer
                }
            });
            const response = await Fetch(request);
            return GetTypedData(await response.arrayBuffer());

        }, priority, signal);
    }

    protected CreateRequest(url: URL, signal: AbortSignal = undefined): Request {
        return new Request(url, {
            signal,
            headers: {
                'Referer': undefined //no referer is mandatory to bypass website protection
            }
        });
    }
}