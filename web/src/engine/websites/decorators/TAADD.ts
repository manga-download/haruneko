import { DOM } from '@microsoft/fast-element';
import { Fetch, FetchCSS, FetchWindowPreloadScript, FetchWindowScript } from '../../platform/FetchProvider';
import { MangaScraper, type Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';
export function MangaLabelExtractor(element: HTMLElement) {
    return ((element as HTMLMetaElement).content || element.textContent).replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
}

type LinkExtractor = (this: MangaScraper, element: HTMLElement) => string;
export function ChapterExtractor(element: HTMLAnchorElement) {
    const id = element.pathname + element.search;
    const title = element.childNodes[0].nodeValue.trim();
    return { id, title };
}

export function PageLinkExtractor(element: HTMLElement) {
    switch (element.nodeName) {
        case 'OPTION'://Most TAADD websites got a selector with options element
            return new URL((element as HTMLOptionElement).value, this.URI).href;
        case 'DIV': //Tenmanga = selector is a div full of <div option_val=url>;
            return element.getAttribute('option_val') || element.textContent;
        default: //just in case. People could always use a custom PageLinkExtractor anyway
            return element.textContent;
    }
}

export const mangaPath = '/search/?completed_series=either&page={page}';
export const queryMangaTitleFromURI = 'meta[property="og:title"]';
export const queryMangas = [
    'div.clistChr ul li div.intro h2 a',
    'a.bookname',
    'a.resultbookname',
].join(',');

export const queryChapters = [
    'div.chapter_list table tr td:first-of-type a',
    'div.chapterbox ul li a.chapter_list_a', //NineManga
].join(',');
export const queryPages = 'select#page option';
export const queryImages = [
    'img#comicpic',
    'img.manga_pic'
].join(',');


/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * The purpose of this is to add search params to bypass adult warning. In case you dont need, use Common.ChaptersSinglePageCSS
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 * @param bypassNsfwWarning - add a param to the url otherwise chapters are hidden for NSFW manga
 */
async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor, bypassNsfwWarning = true): Promise<Chapter[]> {
    const url = new URL(manga.Identifier, this.URI);
    if (bypassNsfwWarning) {
        url.searchParams.set('warning', '1');
        url.searchParams.set('waring', '1'); //NineManga typo
    }

    const data = await FetchCSS<HTMLAnchorElement>(new Request(url), query);
    return data.map(element => {
        const { id, title } = extractor.call(this, element);
        const mangaTitle = manga.Title.replace(/[*^.|$?+\-()[\]{}\\/]/g, '\\$&'); //escape special regex chars in manga name
        let finaltitle = title.replace(new RegExp(mangaTitle, 'i'), '') === '' ? title : title.replace(new RegExp(mangaTitle, 'i'), '');//replace manga title in chapter title
        finaltitle = finaltitle.replace(/\s*new$/, '').trim();
        return new Chapter(this, manga, id, finaltitle );
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * The purpose of this is to add search params to bypass adult warning. In case you dont need, use Common.ChaptersSinglePageCSS
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 * @param bypassNsfwWarning - add a param to the url otherwise chapters are hidden for NSFW manga
 */
export function ChaptersSinglePageCSS(query: string = queryChapters, extractor = ChapterExtractor, bypassNsfwWarning = true) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extractor, bypassNsfwWarning);
            }
        };
    };
}

/*************************************************
 ******** Page List Extraction Methods ************
 *************************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS.
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - A CSS selector to the element containing all subpages : Typically <select> opyions elements
 * @param extractor - A function to extract the subpage information from a single element (found with {@link query})
  * */

export async function FetchPagesSinglePagesCSS(this: MangaScraper, chapter: Chapter, query: string = queryPages, extractor: LinkExtractor = PageLinkExtractor): Promise<Page[]> {
    const data = await FetchCSS<HTMLElement>(new Request(new URL(chapter.Identifier, this.URI)), query);
    //There may be MORE than one page list element on the page, we need only one !
    const subpages = Array.from(new Set([...data.map(element => extractor.call(this, element))]));
    return subpages.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));

}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param query - A CSS selector to the element containing all subpages : Typically <select> opyions elements
 * @param extractor - A function to extract the subpage information from a single element (found with {@link query})
 */

export function PagesSinglePageCSS(query: string = queryPages, extractor: LinkExtractor = PageLinkExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePagesCSS.call(this, chapter, query, extractor );
            }
        };
    };
}


/**
 * An extension method that adds the ability to get the image data when Page is the link to an HTML Page.
 *  Use this when Chapter are composed of multiple html Page and each page hold an image
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param queryImage - a query to get the image in the html page Page
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export async function FetchImageAjaxFromHTML(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, queryImage: string = queryImages, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    const image = await this.imageTaskPool.Add(async () => {
       const request = new Request(page.Link, {
            signal: signal,
               // Referer: page.Link.origin, //To avoid redirection on crappy hosts, DONT USE referrer on html subpages
        });
        const realimage = (await FetchCSS<HTMLImageElement>(request, queryImage))[0].getAttribute('src');
        const parameters = page.Parameters?.Referer ? { Referer: page.Parameters?.Referer } : { Referer: page.Link.origin };
        return new Page(this, page.Parent as Chapter, new URL(realimage, request.url), parameters);
    }, priority, signal);

    return await Common.FetchImageAjax.call(this, image, priority, signal, detectMimeType, deProxifyLink);
}

/**
 * A class decorator that adds the ability to get the image data when Page is the link to an HTML Page.
 * Use this when Chapter are composed of multiple html Page and each page hold an image
 * @param queryImage - a query to get the image in the html page Page
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export function ImageAjaxFromHTML(queryImage: string = queryImages, detectMimeType = false, deProxifyLink = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjaxFromHTML.call(this, page, priority, signal, queryImage, detectMimeType, deProxifyLink);
            }
        };
    };
}