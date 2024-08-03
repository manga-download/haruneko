import type { Chapter, MangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';
export const queryMangaTitle = '#item-detail .title-detail';
export const queryChapter = 'div.list-chapter ul li.row div.chapter a';
export const queryPages = 'div.reading div.page-chapter img';
export const path = '/?page={page}';
export const queryMangas = 'div.ModuleContent div.items div.item figcaption a.jtip';

export function PageExtractor(element: HTMLImageElement): string {
    return element.dataset.original || element.dataset.src || element.getAttribute('src');
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, exclude: RegExp[] = [], query = queryPages): Promise<Page[]> {
    const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, query, PageExtractor);
    return pages.filter(page => !exclude.some(pattern => pattern.test(page.Link.pathname)));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageCSS(exclude: RegExp[] = [], query = queryPages) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, exclude, query);
            }
        };
    };
}