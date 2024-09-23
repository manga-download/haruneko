import { AddAntiScrapingDetection, FetchRedirection } from "../../platform/AntiScrapingDetection";
import { FetchCSS, FetchHTML, FetchWindowScript } from "../../platform/FetchProvider";
import { Chapter, type Manga, type MangaScraper} from "../../providers/MangaPlugin";
import { Page } from "../../providers/MangaPlugin";
import * as Common from './Common';

AddAntiScrapingDetection(async (render) => {
    const dom = await render();
    if (dom.documentElement.innerHTML.includes(`ct_anti_ddos_key`)) { // Sample => Mangagun, NicoManga, Rawinu, Weloma, WeloveManga
        await new Promise(resolve => setTimeout(resolve, 3000));
        return FetchRedirection.Automatic;
    }
    return undefined;
});

export function MangaLabelExtractor(element: HTMLElement) {
    let title = element.getAttribute('text') ? element.getAttribute('text') : element.textContent;
    return CleanTitle(title);
}
export function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    let title = anchor.getAttribute('text') ? anchor.getAttribute('text') : anchor.textContent;
    return { id, title: CleanTitle(title) };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    if (anchor.dataset?.href) {
        anchor.setAttribute('href', anchor.dataset.href + anchor.getAttribute('href'));
    }
    const id = anchor.pathname;
    const titleElement = anchor.querySelector('div.chapter-name');
    const title = titleElement ? titleElement.textContent.trim() : anchor.text.trim();
    return {
        id, title
    };
}

export function CleanTitle(title: string): string {
    title = title.replace(/\s*[~\-―〜]\s*RAW\s*\(MANGA\)\s*$/i, '').trim();
    title = title.replace(/\s*[~\-―〜]\s*(MANGA)?\s*RAW\s*$/i, '').trim();
    title = title.replace(/\(raw\)/i, '').trim();
    return title.replace(/\(manga\)/i, '').trim();
}

export function PageLinkExtractor<E extends HTMLImageElement>(this: MangaScraper, element: E): string {

    let page = element.dataset.aload || element.dataset.src || element.dataset.srcset || element.dataset.original || element.dataset.pagespeedLazySrc || element.src;
    try {
        page = window.atob(page);
    } catch { }
    return page.replace(/\n/g, '');

}

const DefaultExcludes = [/3282f6a4b7_o/, /donate/];
export const pathSinglePageManga = '/manga-list.html?listType=allABC';
export const pathMultiPageManga = '/manga-list.html?page={page}';

export const queryMangaTitle = [
    'li:last-of-type span[itemprop="name"]',
    'ul.manga-info h3',
    'ul.manga-info h1',
].join(',');

export const queryMangas = [
    'span[data-toggle="mangapop"] a',
    'div.media h3.media-heading a',
    'div.container a[data-toggle="mangapop"]',
    'div.card-body div.series-title a'
].join(',');

export const queryChapters = [
    'div#tab-chapper table tr td a.chapter',
    'ul.list-chapters > a',
    'div#tab-chapper div#list-chapters span.title a.chapter'
].join(',');

const queryChaptersAjax = 'a';

export const queryPages = [
    'img.chapter-img',
    'div#chapter-content img',
    'div.chapter-content img'
].join(',');

/**********************************************
 ******** Chapters List Extraction Methods ******
 **********************************************/

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - A function to extract chapter info from an HTML node
 */
export function ChaptersSinglePageCSS(query: string = queryChapters, extractor = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extractor);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - A function to extract chapter info from an HTML node
  */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), query);
    return data.map(anchor => {
        const { id, title } = extractor.call(this, anchor);
        let finaltitle = title.replace(manga.Title, '').trim() ?? title;
        return new Chapter(this, manga, id, CleanTitle(finaltitle));
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using FlatManga AJAX call.
 * @param endpoint - the api endpoint used to query chapters list. I.e /app/controller/listchapters.php?slug= . Must end with ?<something>=
 * @param mangaIdVariable - the name of the javascript variable containing the mangaid value. The value be appended to {@link endpoint}
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted (from the api call)
 * @param extractor - A function to extract chapter info from an HTML node
 */
export function ChaptersSinglePageAJAX(endpoint: string, mangaIdVariable: string, query = queryChapters, extractor = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAX.call(this, manga, endpoint, mangaIdVariable, query, extractor);
            }
        };
    };

}
/** Extract all chapters for a given manga from this website using FlatManga AJAX call.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param endpoint - the api endpoint used to query chapters list. I.e "/app/controller/listchapters.php?slug=". Must end with a query string ?<something>=.
 * @param mangaIdVariable - the name of the javascript variable containing the mangaid value. The value will be appended to {@link endpoint}
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted (from the api call)
 * @param extractor - A function to extract chapter info from an HTML node
 * @returns
 */
export async function FetchChaptersSinglePageAJAX(this: MangaScraper, manga: Manga, endpoint: string, mangaIdVariable: string, query = queryChaptersAjax, extractor = ChapterExtractor): Promise<Chapter[]> {
    let request = new Request(new URL(manga.Identifier, this.URI), {
        headers: {
            'Referer': this.URI.origin
        }
    });
    const mangaRegexp = new RegExpSafe(`var ${mangaIdVariable}\\s*=\\s*['"]([^'"]+)['"]`);
    const mangaSlug = (await FetchHTML(request)).documentElement.innerHTML.match(mangaRegexp)[1];
    const apiUrl = new URL(`${endpoint}${mangaSlug}`, this.URI);

    request = new Request(apiUrl, {
        headers: {
            'Referer': this.URI.origin
        }
    });
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(chapter => {
        const { id, title } = extractor.call(this, chapter);
        let finaltitle = title.replace(manga.Title, '').trim() ?? title;
        return new Chapter(this, manga, id, CleanTitle(finaltitle));
    });
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param extractor - A function to extract page link from an HTML node
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query: string = queryPages, exclude: RegExp[] = DefaultExcludes, extractor = PageLinkExtractor): Promise<Page[]> {
    const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, query, extractor);
    return pages.filter(page => !exclude.some(pattern => pattern.test(page.Link.href))).map(page => new Page(this, chapter, page.Link, { Referer: this.URI.origin }));
}

/**
 * A class decorator that adds the ability to extract all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param extractor - A function to extract page link from an HTML node
 */
export function PagesSinglePageCSS(query: string = queryPages, excludes: RegExp[] = DefaultExcludes, extractor = PageLinkExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query, excludes, extractor);
            }
        };
    };
}

/**
 * An extension method for extracting all pages for extracting all pages for the given {@link chapter} using the FlatManga AJAX API.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param endpoint - the api endpoint used to query pages list. I.e "/app/controller/cont.listimg.php?cid=". Must end with a query string ?<something>=.
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param extractor - A function to extract page link from an HTML node
 */
export async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter, endpoint: string, query: string = 'img', exclude: RegExp[] = DefaultExcludes, extractor = PageLinkExtractor): Promise<Page[]> {
    let request = new Request(new URL(chapter.Identifier, this.URI), {
        headers: {
            'Referer': this.URI.origin,
        }
    });

    const chapterId = await FetchWindowScript<string>(request, `document.querySelector('input#chapter').value`, 3000);//use script in case of antiDdoSS/PageSpeed
    request = new Request(new URL(`${endpoint}${chapterId}`, this.URI), {
        headers: {
            'Referer': this.URI.origin,
        }
    });

    const data = await FetchCSS<HTMLImageElement>(request, query);
    const pages = data.map(page => extractor.call(this, page));
    return pages.filter(url => !exclude.some(pattern => pattern.test(url))).map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.origin }));
}

/**
 * A class decorator that adds the ability to extract all pages for the given {@link chapter} using the FlatManga AJAX API.
 * @param endpoint - the api endpoint used to query pages list. I.e "/app/controller/cont.listimg.php?cid=". Must end with a query string ?<something>=.
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param extractor - A function to extract page link from an HTML node
 */
export function PagesSinglePageAJAX(endpoint: string, query: string = queryPages, excludes: RegExp[] = DefaultExcludes, extractor = PageLinkExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter, endpoint, query, excludes, extractor);
            }
        };
    };
}