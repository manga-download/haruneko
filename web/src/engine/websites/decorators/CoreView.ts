import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Exception } from '../../Error';
import { FetchCSS, FetchHTML, FetchJSON } from '../../platform/FetchProvider';
import { Chapter, type Manga, type MangaScraper, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import DeScramble from '../../transformers/ImageDescrambler';
import * as Common from './Common';

export const queryMangaTitleFromURI = '.series-header-title';
const defaultQueryChapters = 'a.series-episode-list-container';
const queryEpisodeJSON = '#episode-json';

type ChapterCategory = 'magazine' | 'volume' | 'episode';

type ChapterJSON = {
    readableProduct: {
        isPublic: boolean;
        hasPurchased: boolean;
        pageStructure: {
            choJuGiga: string;
            pages: {
                type: string;
                src: string;
            }[]
        }
    }
};

type APIChaptersHTML = {
    html: string;
    nextUrl: string;
};

type APIChapterV2 = {
    title: string;
    viewer_uri: string;
};

type PageParams = {
    scrambled: boolean;
};

/**
 * Creates an info extractor that will parse the media id from the first found {@link HTMLAnchorElement}
 * and the media title from the first element found via {@link queryTitle} (or from the {@link HTMLAnchorElement} in case none was found).
 * @param queryTitle - An optional CSS query which can be used to remove all matching child elements before extracting the media title
 */
function CreateMangaExtractor(queryTitle: string) {
    return function (element: HTMLElement) {
        const id = element instanceof HTMLAnchorElement ? element.pathname : element.querySelector<HTMLAnchorElement>('a').pathname;
        const title = (element.querySelector<HTMLElement>(queryTitle) || element).textContent.trim();
        return { id, title };
    };
}

export const DefaultMangaExtractor = CreateMangaExtractor([
    '.series-list-title',
    '.series-title',
    'h4.daily-series-title',
    '.item-series-title',
    'h4.title'
].join(','));

function ChapterExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLElement>('.series-episode-list-title').textContent.trim()
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting chapters using Coreview API. Use this when website uses endpoint 'readable_products'.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param query - A CSS selector used to extract chapters from the api answer (html from json)
 * @param extractor - A function to extract id and title from queried elements
 */
export function ChaptersMultiPagesAJAXV1(query: string = defaultQueryChapters, extractor = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersMultiPageAJAXV1.call(this, manga, query, extractor);
            }
        };
    };
}

/**
 * A class decorator for extracting chapters using Coreview API. Use this when website uses endpoint 'readable_products'.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param queryChapters - A CSS selector used to extract chapters from the api answer (html from json)
 * @param extractor - A function to extract id and title from queried elements
 */
export async function FetchChaptersMultiPageAJAXV1(this: MangaScraper, manga: Manga, queryChapters: string = defaultQueryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const doc = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));
    const readableProductList = doc.querySelector<HTMLDivElement>('.js-readable-product-list');
    const readMoreElement = doc.querySelector<HTMLDivElement>('.js-read-more-button');

    return [
        ...await AjaxFetchEntriesFromHTML.call(this, manga, readableProductList.dataset.firstListEndpoint, 1, queryChapters, extractor),
        ...
        readMoreElement
            ? await AjaxFetchEntriesFromHTML.call(this, manga, readMoreElement.dataset.readMoreEndpoint, parseInt(readMoreElement.dataset.maxReadMoreCount), queryChapters, extractor)
            : [],
        ...await AjaxFetchEntriesFromHTML.call(this, manga, readableProductList.dataset.latestListEndpoint, 1, queryChapters, extractor),
    ];
}
/**
 * Extract entries (episode volume magazine) from V1 API.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapte
 * @param endpoint - Starting endpoint to use.
 * @param count - How many pages to fetch, because the api ALWAYS return a "nextUrl" so its unreliable.
 * @param queryChapters - A CSS selector used to extract chapters from the api answer (html from json)
 * @param extractor - A function to extract id and title from queried elements
 */
async function AjaxFetchEntriesFromHTML(this: MangaScraper, manga: Manga, endpoint: string, count: number = 1, queryChapters: string = defaultQueryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const chaptersList: Chapter[] = [];
    for (let i = 1; i <= count; i++) {
        const { html, nextUrl } = await FetchJSON<APIChaptersHTML>(new Request(new URL(endpoint, this.URI)));
        const nodes = new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>(queryChapters).values();
        for (const chapterNode of nodes) {
            const { id, title } = extractor(chapterNode);
            chaptersList.push(new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title));
        }
        endpoint = nextUrl;
    };
    return chaptersList;
}

/**
 * A class decorator for extracting chapters using Coreview API. Use this when endpoint 'pagination_readable_products' is available.
 * @param categories - Specify the types that shall be included when searching chapters (Defaults to `['volume', 'epsiode']`)
 */
export function ChaptersMultiPageAJAXV2(...categories: ChapterCategory[]) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersMultiPageAJAXV2.call(this, manga, ...categories);
            }
        };
    };
}

/**
 * An extension method for extracting chapters using Coreview API. Use this when endpoint 'pagination_readable_products' is available.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param categories - Specify the types that shall be included when searching chapters (Defaults to (`['volume', 'epsiode']`)
 */
export async function FetchChaptersMultiPageAJAXV2(this: MangaScraper, manga: Manga, ...categories: ChapterCategory[]): Promise<Chapter[]> {
    const aggregateId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '.js-readable-products-pagination')).at(0).dataset.aggregateId;
    const chapterList: Chapter[] = [];

    categories = categories.length ? categories : ['volume', 'episode'];
    for (const type of categories) {
        for (let offset = 0, run = true; run;) {
            const url = new URL(`./api/viewer/pagination_readable_products`, this.URI);
            url.search = new URLSearchParams({
                aggregate_id: aggregateId,
                type,
                sort_order: 'desc',
                offset: offset.toString()
            }).toString();

            const data = await FetchJSON<APIChapterV2[]>(new Request(url));
            const chapters = data.map(chapter => {
                const title = chapter.title.replace(manga.Title, '').trim() || chapter.title;
                return new Chapter(this, manga, new URL(chapter.viewer_uri).pathname, title);
            });
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
            offset += chapters.length;
        }
    }
    return chapterList;
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
async function FetchPagesSinglePageJSON(this: MangaScraper, chapter: Chapter, query = queryEpisodeJSON): Promise<Page<PageParams>[]> {
    const request = new Request(new URL(chapter.Identifier, this.URI));
    const dataElement = await FetchCSS(request, query);
    const { readableProduct }: ChapterJSON = JSON.parse(dataElement[0].dataset.value);
    if (!readableProduct.isPublic && !readableProduct.hasPurchased) {
        throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
    }
    return readableProduct.pageStructure.pages.filter(page => page.type === 'main').map(page => {
        // NOTE: 'usagi' is not scrambled
        const parameters = { Referer: this.URI.href, scrambled: readableProduct.pageStructure.choJuGiga === 'baku' };
        return new Page<PageParams>(this, chapter, new URL(page.src, request.url), parameters);
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
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page<PageParams>[]> {
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
async function FetchImage(this: MangaScraper, page: Page<PageParams>, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
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
            public async FetchImage(this: MangaScraper, page: Page<PageParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}
