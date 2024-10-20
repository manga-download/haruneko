//viewer decorators for websites using CLIP STUDIO READER
// https://www.celsys.com/en/e-booksolution/lab/
//Pages are scrambled, informations are inside XMLs, and php scripts are named like diazepam_hybrid.php / lorezapam

import { Fetch } from "../../platform/FetchProvider";
import { Page, type Chapter, type MangaScraper } from "../../providers/MangaPlugin";
import type { Priority } from "../../taskpool/DeferredTask";
import DeScramble from "../../transformers/ImageDescrambler";
import * as Common from "./Common";

type PageData = {
    width: number,
    height: number,
    scramble: {
        width: number,
        height: number
    }
}

type PartData = {
    number: number,
    scramble: boolean,
    type: PartType
}

type ImagePart = {
    binaryArray?: Uint8Array,
    image?: HTMLImageElement,
    scramble: boolean
}

enum PartType {
    DATA_TYPE_LESIA = 10,
    DATA_TYPE_LESIA_OLD = 7,
    DATA_TYPE_JPEG = 1,
    DATA_TYPE_GIF = 2,
    DATA_TYPE_PNG = 3,

};
enum Modes {
    MODE_DL_XML = '0',
    MODE_DL_JPEG = '1',
    MODE_DL_GIF = '2',
    MODE_DL_PNG = '3',
    MODE_DL_FACE_XML = '7',
    MODE_DL_PAGE_XML = '8'
}

enum RequestType {
    REQUEST_TYPE_FILE = '0',
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the CLIP STUDIO READER AJAX API.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 */
export async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
    const pages: Page[] = [];

    const chapterUrl = new URL(chapter.Identifier, this.URI);
    const response = await Fetch(new Request(chapterUrl, { headers: { Referer: this.URI.origin } }));
    if (response.redirected) chapterUrl.href = response.url;

    //try to get parameters from querystring
    let authkey = chapterUrl.searchParams.get('param');
    let endpoint = chapterUrl.searchParams.get('cgi');

    if (!authkey || !endpoint) {//otherwise get elements from body
        const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
        const metadatas = new Map<string, string>();
        dom.querySelectorAll<HTMLInputElement>('div#meta input').forEach(element => metadatas.set(element.name, element.value));
        authkey = metadatas.get('param');
        endpoint = metadatas.get('cgi');
    }

    const url = new URL(endpoint, this.URI);
    url.searchParams.set('mode', Modes.MODE_DL_FACE_XML);
    url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
    url.searchParams.set('vm', '4');
    url.searchParams.set('file', 'face.xml');
    url.searchParams.set('param', authkey);

    const XML = await FetchXML(new Request(url));
    const totalpages = parseInt(XML.getElementsByTagName('TotalPage')[0].textContent);

    const pagedata: PageData = {
        width: parseInt(XML.getElementsByTagName('Width')[0].textContent),
        height: parseInt(XML.getElementsByTagName('Height')[0].textContent),
        scramble: {
            width: parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Width').textContent),
            height: parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Height').textContent)
        },
    };

    for (let i = 0; i < totalpages; i++) {
        const pagename = i.toString().padStart(4, '0') + '.xml';
        const url = new URL(endpoint, this.URI);
        url.searchParams.set('mode', Modes.MODE_DL_PAGE_XML);
        url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
        url.searchParams.set('vm', '4');
        url.searchParams.set('file', pagename);
        url.searchParams.set('param', authkey);
        pages.push(new Page<PageData>(this, chapter, new URL(url), { ...pagedata }));
    }

    return pages;
}

/**
 * A class decorator for extracting all pages for the given {@link chapter} using the CLIP STUDIO READER AJAX API.
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

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page} according to an XHR based-approach.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 */
export async function FetchImageAjax(this: MangaScraper, page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        try {

            const pageData = page.Parameters;

            //fetch Page XML
            const XML = await FetchXML(new Request(page.Link));
            const pageIndex = parseInt(XML.getElementsByTagName('PageNo')[0].textContent);
            const endpoint = page.Link.origin + page.Link.pathname;
            const authkey = page.Link.searchParams.get('param');
            const scrambleArray = XML.getElementsByTagName('Scramble')[0].textContent.split(',').map(element => parseInt(element));
            const parts: PartData[] = [...XML.getElementsByTagName('Kind')].map(element => {
                return {
                    number: parseInt(element.getAttribute('No')),
                    scramble: element.getAttribute('scramble') === '1',
                    type: parseInt(element.textContent)
                };
            });

            return DeScramble(new ImageData(pageData.width, pageData.height), async (_, ctx) => {

                for (const partData of parts) {
                    switch (partData.type) {
                        case PartType.DATA_TYPE_JPEG:
                        case PartType.DATA_TYPE_GIF:
                        case PartType.DATA_TYPE_PNG:
                        case PartType.DATA_TYPE_LESIA:
                        case PartType.DATA_TYPE_LESIA_OLD: {

                            const partFileName = [pageIndex.toString().padStart(4, '0'), partData.number.toString().padStart(4, '0')].join('_') + '.bin';
                            const imageUrl = new URL(endpoint);
                            let type = partData.type;
                            type !== PartType.DATA_TYPE_LESIA && type !== PartType.DATA_TYPE_LESIA_OLD || (type = PartType.DATA_TYPE_JPEG);
                            imageUrl.searchParams.set('mode', type.toString());
                            imageUrl.searchParams.set('file', partFileName);
                            imageUrl.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
                            imageUrl.searchParams.set('param', authkey);
                            const part = await LoadPart(imageUrl, partData);

                            if (part.image) {

                                if (part.scramble) {

                                    const numCols = pageData.scramble.width;
                                    const numRow = pageData.scramble.height;
                                    const pieceWidth = 8 * Math.floor(Math.floor(part.image.width / numCols) / 8);
                                    const pieceHeight = 8 * Math.floor(Math.floor(part.image.height / numRow) / 8);

                                    if (!(scrambleArray.length < numCols * numRow || part.image.width < 8 * numCols || part.image.height < 8 * numRow)) {
                                        for (let scrambleIndex = 0; scrambleIndex < scrambleArray.length; scrambleIndex++) {
                                            let p: number;
                                            let pieceX = scrambleIndex % numCols;
                                            let pieceY = Math.floor(scrambleIndex / numCols);
                                            pieceX *= pieceWidth;
                                            pieceY *= pieceHeight;
                                            let sourceX = (p = scrambleArray[scrambleIndex]) % numCols;
                                            let sourceY = Math.floor(p / numCols);
                                            sourceX *= pieceWidth;
                                            sourceY *= pieceHeight;
                                            ctx.clearRect(pieceX, pieceY, pieceWidth, pieceHeight);//
                                            ctx.drawImage(part.image, sourceX, sourceY, pieceWidth, pieceHeight, pieceX, pieceY, pieceWidth, pieceHeight);
                                        }
                                        part.image = null;

                                    }
                                } else ctx.drawImage(part.image, 0, 0);
                            } else throw new Error('Binary image not supported !');
                            break;
                        }
                    }
                }

            });
        } catch (error) {
            Promise.reject(error);
        }
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 */
export function ImageAjax() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal);
            }
        };
    };
}

async function FetchXML(request: Request): Promise < XMLDocument > {
    const response = await Fetch(request);
    const data = await response.text();
    return new DOMParser().parseFromString(data, 'text/xml');
}
async function LoadPart(imageUrl: URL, partData: PartData): Promise<ImagePart> {
    if (partData.type === PartType.DATA_TYPE_LESIA || partData.type === PartType.DATA_TYPE_LESIA_OLD) {
        throw new Error('Binary part not supported');
    } else {
        return { image: await LoadImage(imageUrl), scramble: partData.scramble };
    }
}

async function LoadImage(url: URL): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const uri = new URL(url);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = uri.href;
    });
}