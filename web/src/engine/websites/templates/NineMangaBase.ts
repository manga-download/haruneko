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
        const [select] = await FetchCSS<HTMLSelectElement>(this.CreateRequest(chapterUrl), 'select#page');
        return [...select.querySelectorAll<HTMLOptionElement>('option')].map(({ value }) => new Page(this, chapter, new URL(value, this.URI), { Referer: chapterUrl.href }));
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