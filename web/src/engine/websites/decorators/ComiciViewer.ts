//Comici viewer based websites : BigComics, YoungChampion, YoungAnimal, ComicMedu, ComicRide

import { Exception } from "../../Error";
import { FetchCSS, FetchJSON } from "../../platform/FetchProvider";
import { Page, Chapter, type MangaScraper, type Manga } from "../../providers/MangaPlugin";
import type { Priority } from "../../taskpool/DeferredTask";
import DeScramble from "../../transformers/ImageDescrambler";
import * as Common from "./Common";
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

export const mangaListPath = '/series/list?page={page}';
export const queryMangaTitleURI = 'h1.series-h-title span:not([class])';
export const queryManga = 'div.series-box-vertical > a';
const queryMangaTitle = 'h2.title-text';
export const queryChapter = 'div.series-ep-list a[data-href]';
const queryChapterTitle = 'span.series-ep-list-item-h-text';

const defaultOrder: Array<Array<number>> = [];
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        defaultOrder.push([i, j]);
    }
}

type APIResult<T> = {
    code: number,
    message: string,
    result: T,
    totalPages: number
}

type APIPage = {
    imageUrl: string,
    scramble: string
}

type ScrambleData = {
    scramble: string
}

export function MangaExtractor(element: HTMLAnchorElement) {
    const titleElement = element.querySelector<HTMLElement>(queryMangaTitle);
    return {
        id: element.pathname.replace(/\/$/, ''),
        title: titleElement ? titleElement.textContent.trim() : element.text.trim()
    };
}

export function ChapterExtractor(element: HTMLAnchorElement) {
    const titleElement = element.querySelector(queryChapterTitle);
    return {
        id: new URL(element.dataset['href']).pathname,
        title: titleElement ? titleElement.textContent .trim() : element.text.trim()
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
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query: string = queryChapter, extract = ChapterExtractor): Promise<Chapter[]> {
    const uri = new URL(manga.Identifier+ '/list', this.URI);
    const request = new Request(uri, {
        headers: {
            Referer: this.URI.origin
        }
    });
    const data = await FetchCSS(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export function ChaptersSinglePageCSS(query: string = queryChapter, extract = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 */
export async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter): Promise<Page<ScrambleData>[]> {
    const request = new Request(new URL(chapter.Identifier, this.URI), {
        headers: {
            Referer: this.URI.origin
        }
    });
    const [viewer] = await FetchCSS(request, '#comici-viewer');
    if (!viewer) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

    const viewerId = viewer.getAttribute('comici-viewer-id');
    const userId = viewer.dataset['memberJwt'];

    const coord = await FetchCoordInfo.call(this, viewerId, userId, chapter);
    return coord.result.map(image => new Page<ScrambleData>(this, chapter, new URL(image.imageUrl), { scramble: image.scramble, Referer: this.URI.origin }));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 */
export function PagesSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter);
            }
        };
    };
}

async function FetchCoordInfo(this: MangaScraper, viewerId: string, userId : string, chapter : Chapter): Promise<APIResult<APIPage[]>> {
    //first request get page count
    const { totalPages } = await FetchJSON<APIResult<APIPage[]>>(CreateChapterRequest.call(this, '1', viewerId, userId, chapter));

    //second request fetch actual pages data
    return FetchJSON<APIResult<APIPage[]>>(CreateChapterRequest.call(this, totalPages.toString(), viewerId, userId, chapter));
}

function CreateChapterRequest(this: MangaScraper, pageTo: string, viewerId: string, userId: string, chapter: Chapter): Request {
    return new Request(new URL(`/book/contentsInfo?comici-viewer-id=${viewerId}&user-id=${userId}&page-from=0&page-to=${pageTo}`, this.URI), {
        headers: {
            Origin: this.URI.origin,
            Referer: new URL(chapter.Identifier, this.URI).href
        }
    });
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
async function FetchImage(this: MangaScraper, page: Page<ScrambleData>, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    const data = await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType);
    return !page.Parameters?.scramble ? data : DeScramble(data, async (image, ctx) => {

        const decodedArray = DecodeScrambleArray(page.Parameters.scramble);
        const tileWidth = Math.floor(image.width / 4);
        const tileHeight = Math.floor(image.height / 4);
        for (let k = 0, i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const x = decodedArray[k][0], y = decodedArray[k][1];
                ctx.drawImage(image, tileWidth * x, tileHeight * y, tileWidth, tileHeight, tileWidth * i, tileHeight * j, tileWidth, tileHeight);
                k++;
            }
        }
    });

}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageAjax(detectMimeType = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}

function DecodeScrambleArray(scramble: string): number[][] {
    const decoded : number[][]= [];
    const encoded = scramble.replace(/\s+/g, '').slice(1).slice(0, -1).split(',');
    for (let i = 0; i < defaultOrder.length; i++) {
        decoded.push(defaultOrder[encoded[i]]);
    }
    return decoded;
}
