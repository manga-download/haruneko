import { AddAntiScrapingDetection, FetchRedirection } from "../../platform/AntiScrapingDetection";
import { FetchWindowScript } from "../../platform/FetchProvider";
import { type Chapter, type MangaScraper} from "../../providers/MangaPlugin";
import { Page } from "../../providers/MangaPlugin";
import * as Common from './Common';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('ct_anti_ddos_key')`);// Sample => Mangagun, NicoManga, Rawinu, Weloma, WeloveManga
    if (result) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return FetchRedirection.Automatic;
    } else return undefined;

});

export function MangaLabelExtractor(element: HTMLElement) {
    return CleanTitle(element.getAttribute('text') ? element.getAttribute('text') : element.textContent);
}
export function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.getAttribute('text') ? anchor.text : anchor.textContent)
    };
}

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    if (anchor.dataset?.href) {
        anchor.setAttribute('href', anchor.dataset.href + anchor.getAttribute('href'));
    }
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.querySelector('div.chapter-name') ? anchor.querySelector('div.chapter-name').textContent.trim() : anchor.text.trim())
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

export const queryPages = [
    'img.chapter-img',
    'div#chapter-content img',
    'div.chapter-content img'
].join(',');

/**********************************************
 ******** Chapters List Extraction Methods ******
 **********************************************/

/**
* A class decorator that adds the ability to extract all chapters for a given manga using a pre-defined JS script.
* The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
* @param path - A JS script snippet to get the relative URL for fetching the HTML fragment containing the chapters
* @param query - A CSS query to locate the elements from which the chapters information shall be extracted
* @param extract - A JS arrow function to extract the pathname and title from the html element
* @param delay - An initial delay [ms] before the pre-defined script is executed
*/
export function ChaptersSinglePageJS(path = `'/app/manga/controllers/cont.Listchapter.php?slug=' + sLugs`, query = 'a', extract = `anchor => { return { id: anchor.pathname, title: anchor.title.trim() }}`, delay = 500) {
    return Common.ChaptersSinglePageJS(`
        new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(${path});
                const html = await response.text();
                const chapters = [ ...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('${query}') ]
                    .map(${extract});
                resolve(chapters);
            } catch(error) {
                reject(error);
            }
        });
    `, delay);
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

function PageScript(path: string, query: string): string {
    return `
        new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('${path}' + document.querySelector('input#chapter').value );
                const html = await response.text();
                const images = [ ...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('${query}') ]
                    .map(element => {
                        const page = element.dataset.aload || element.dataset.src || element.dataset.srcset || element.dataset.original || element.dataset.pagespeedLazySrc || element.src;
                        try {
                            page = window.atob(page);
                        } catch { }
                        return page.replace(/\\n/g, '');
                    });
                resolve(images);
            } catch(error) {
                reject(error);
            }
        });
    `;
}

/**
 * An extension method for extracting all pages for extracting all pages for the given {@link chapter} using the FlatManga AJAX API.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param path - the api endpoint used to query pages list.
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param delay - An initial delay [ms] before the pre-defined script is executed
 */
export async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter, path: string, query: string = 'img', exclude: RegExp[] = DefaultExcludes, delay = 500 ): Promise<Page[]> {
    const pages = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), PageScript(path, query), delay);
    return pages.filter(url => !exclude.some(pattern => pattern.test(url))).map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.origin }));
}

/**
 * A class decorator that adds the ability to extract all pages for the given {@link chapter} using the FlatManga AJAX API.
 * @param path - the api endpoint used to query pages list.
 * @param query - CSS query to get page link
 * @param exclude - a Regexp array to exclude page pattern
 * @param delay - An initial delay [ms] before the pre-defined script is executed
 */
export function PagesSinglePageAJAX(path: string, query: string = queryPages, excludes: RegExp[] = DefaultExcludes, delay = 500) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter, path, query, excludes, delay);
            }
        };
    };
}