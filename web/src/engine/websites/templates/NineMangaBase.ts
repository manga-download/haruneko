import { Fetch, FetchCSS } from '../../platform/FetchProvider';
import { type Manga, Chapter, Page, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';
import { GetTypedData } from '../decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
};

function ChapterExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname + element.search,
        title: (element.querySelector<HTMLTableCellElement>('td.chp-idx')?.textContent || element.childNodes[0].nodeValue).trim()
    };
}

function PageLinkExtractor(element: HTMLOptionElement) {
    return new URL((element as HTMLOptionElement).value, this.URI).href;
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html/, 'div.manga div.ttline h1', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.textContent) }))
@Common.MangasMultiPageCSS('dl.bookinfo a.bookname', Common.PatternLinkGenerator('/search/?completed_series=either&page={page}'))
export class NineMangaBase extends DecoratableMangaScraper {

    protected nsfwUrlParameter: string = 'waring';// typo of 'warning' for NineManga websites

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        if (this.nsfwUrlParameter) {
            url.searchParams.set(this.nsfwUrlParameter, '1');
        }
        const data = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div.chapterbox ul li a.chapter_list_a');
        return data.map(element => {
            const { id, title } = ChapterExtractor.call(this, element);
            const escapedMangaTitle = manga.Title.replace(/[*^.|$?+\-()[\]{}\\/]/g, '\\$&'); //escape special regex chars in manga name
            const finaltitle = title.replace(new RegExpSafe(escapedMangaTitle, 'i'), '') ?? title;
            return new Chapter(this, manga, id, finaltitle.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const data = await FetchCSS<HTMLElement>(this.CreateRequest(chapterUrl), 'select#page option');
        //There may be MORE than one page list element on the page, we need only one ! In case of direct picture links, doesnt matter
        const subpages = Array.from(new Set([...data.map(element => PageLinkExtractor.call(this, element))]));
        return subpages.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: chapterUrl.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return await this.imageTaskPool.Add(async () => {
            let request = this.CreateRequest(page.Link);
            const realimage = (await FetchCSS<HTMLImageElement>(request, 'img.manga_pic')).at(0).getAttribute('src');
            request = new Request(realimage, {
                signal,
                headers: {
                    Referer: page.Parameters?.Referer ? page.Parameters.Referer : page.Link.origin
                }
            });
            const response = await Fetch(request);
            return GetTypedData(await response.arrayBuffer());

        }, priority, signal);
    }

    protected CreateRequest(url: URL, signal: AbortSignal = undefined): Request {
        const MinFirefoxVersion = 130;
        const FirefoxVersion = Math.floor(Math.random() * (999 - MinFirefoxVersion + 1)) + MinFirefoxVersion;
        return new Request(url, {
            signal,
            headers: {
                'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${FirefoxVersion}.0) Gecko/20100101 Firefox/${FirefoxVersion}.0`,
                'Referer': undefined
            }
        });
    }
}