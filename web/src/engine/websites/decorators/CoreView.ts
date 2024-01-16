import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Exception } from '../../Error';
import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import DeScramble from '../../transformers/ImageDescrambler';

export const mangaPaths = ['/series', '/series/oneshot', '/series/finished'];
export const queryMangaTitleFromURI = '.series-header-title';

// The query to select *all* required data for *one* manga
export const queryMangas = 'article.series-list-wrapper ul.series-list > li.series-list-item > a';

const queryMangaURI: string = undefined;
// The query to retrieve the single manga title from inside of this.queryManga
export const queryMangaTitle = [
    '.series-list-title',
    '.series-title',
    'h4.daily-series-title',
    '.item-series-title'
].join(',');

const queryChaptersAtomFeed = 'head link[type*="atom+xml"]';
export const queryChapters = 'feed entry';
export const queryEpisodeJSON = '#episode-json';

type ChapterJSON = {
    readableProduct: {
        isPublic: boolean,
        hasPurchased: boolean,
        pageStructure: {
            choJuGiga: string,
            pages : {
                type: string,
                src: string
            }[]
        }
    }
}
function MangaExtractor(element: HTMLElement, queryURI: string, queryTitle: string) {
    const id = (element.querySelector<HTMLAnchorElement>(queryURI) || element as HTMLAnchorElement).pathname;
    const title = (element.querySelector<HTMLElement>(queryTitle) || element).textContent.trim();
    return { id, title };
}

function ChapterExtractor(element: HTMLElement, manga: Manga) {
    const title = element.querySelector('title').textContent.replace(manga.Title, '').trim() || manga.Title;
    const id = new URL(element.querySelector<HTMLLinkElement>('link').href, this.URI).pathname;
    return { id, title };
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/
//use COMMON.MangaCSS(queryMangaTitleFromURI)

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param paths - A collection of path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param queryURI - Optional query to pinpoint the URI inside of {@link query} . Most sites don't need this
 * @param queryTitle - The query to retrieve the single manga title from inside of {@link query}
 * @param extractor - An Extractor to get manga infos

 */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, paths = mangaPaths, query = queryMangas, queryURI = queryMangaURI, queryTitle = queryMangaTitle, extractor = MangaExtractor): Promise<Manga[]> {
    const mangaList = [];
    for (const page of paths) {
        const uri = new URL(page, this.URI).href;
        const request = new Request(uri);
        const data = await FetchCSS(request, query);
        const mangas= data.map(element => {
            const { id, title } = extractor.call(this, element, queryURI, queryTitle);
            return new Manga(this, provider, id, title);
        });

        mangaList.push(...mangas);
    }
    return mangaList;
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param paths - A collection of path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param queryURI - Optional query to pinpoint the URI inside of {@link query} . Most sites don't need this
 * @param queryTitle - The query to retrieve the single manga title from inside of {@link query}
 * @param extractor - An Extractor to get manga infos
  */
export function MangasMultiPageCSS(paths = mangaPaths, query = queryMangas, queryURI = queryMangaURI, queryTitle = queryMangaTitle, extractor = MangaExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, paths, query, queryURI, queryTitle, extractor);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const request = new Request(new URL(manga.Identifier, this.URI).href);
    let data = await FetchCSS<HTMLLinkElement>(request, queryChaptersAtomFeed);
    const uri = new URL(data[0].href, this.URI);
    uri.searchParams.set('free_only', '0'); // 0: include non-free, 1: exclude non-free
    data = await FetchCSS(new Request(uri.href), query);
    return data.map(element => {
        const { id, title } = extractor.call(this, element, manga);
        return new Chapter(this, manga, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
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

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - A CSS query to locate the JSON from which the page information shall be extracted
 */
async function FetchPagesSinglePageJSON(this: MangaScraper, chapter: Chapter, query = queryEpisodeJSON): Promise<Page[]> {
    const request = new Request(new URL(chapter.Identifier, this.URI).href);
    const dataElement = await FetchCSS(request, query);
    const data: ChapterJSON = JSON.parse(dataElement[0].dataset.value);
    if (!data.readableProduct.isPublic && !data.readableProduct.hasPurchased) {
        throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
    }
    return data.readableProduct.pageStructure.pages.filter(page => page.type === 'main').map(page => {
        // NOTE: 'usagi' is not scrambled
        const parameters = { Referer: this.URI.href, scrambled: data.readableProduct.pageStructure.choJuGiga === 'baku' };
        return new Page(this, chapter, new URL(page.src, request.url), parameters);
    });
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageJSON(query = queryEpisodeJSON) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJSON.call(this, chapter, query);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    const data: Blob = await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType);
    return page.Parameters.scrambled ? DeScramble(data, descramble) : data;
}

async function descramble(bitmap: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D) {
    const width = bitmap.width;
    const height = bitmap.height;
    const DIVIDE_NUM = 4;
    const MULTIPLE = 8;
    const cell_width = Math.floor(width / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE;
    const cell_height = Math.floor(height / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE;
    //view.drawImage(0, 0, width, height, 0, 0);
    ctx.drawImage(bitmap, 0, 0, width, height, 0, 0, width, height);
    for (let e = 0; e < DIVIDE_NUM * DIVIDE_NUM; e++) {
        const t = Math.floor(e / DIVIDE_NUM) * cell_height;
        const n = e % DIVIDE_NUM * cell_width;
        const r = Math.floor(e / DIVIDE_NUM);
        const i = e % DIVIDE_NUM * DIVIDE_NUM + r;
        const o = i % DIVIDE_NUM * cell_width;
        const s = Math.floor(i / DIVIDE_NUM) * cell_height;
        //view.drawImage(n, t, cell_width, cell_height, o, s);
        ctx.drawImage(bitmap, n, t, cell_width, cell_height, o, s, cell_width, cell_height);
    }
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageAjax(detectMimeType = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}
