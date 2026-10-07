//viewer decorators for websites using CLIP STUDIO READER
// https://www.celsys.com/en/e-booksolution/lab/
//Pages are scrambled, information is inside XMLs, and php scripts are named like diazepam_hybrid.php / lorazepam

import { Fetch } from '../../platform/FetchProvider';
import { Page, type Chapter, type MangaScraper } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import DeScramble from '../../transformers/ImageDescrambler';
import * as Common from './Common';

type PagesInfos = {
    //Width: number;
    //Height: number;
    ContentType: number;
    /*BgColor: {
        Red: number;
        Green: number;
        Blue: number;
    };*/
    TotalPage: number;
    //Version: string;
    //Guid: string;
    NumColumns: number;
    NumRows: number;
    // OptionId: string;
}

type ImageInfos = {
    PageIndex: number;
    Parts: PartData[];
    ScrambleArray: number[];
    StepRect: {
        Width: number;
        Height: number;
    }
};

type PartData = {
    number: number;
    scramble: boolean;
    type: PartType;
};

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
};

enum RequestType {
    REQUEST_TYPE_FILE = '0',
};

class XMLDeserializer {
    #xml: Promise<XMLDocument>;

    constructor(xmlRequest: Request) {
        this.#xml = Fetch(xmlRequest)
            .then(response => response.text())
            .then(text => new DOMParser().parseFromString(text, 'application/xml'));
    }

    async GetText(selector: string): Promise<string> {
        const el = (await this.#xml).querySelector(selector);
        return el ? el.textContent || '' : '';
    };

    async GetNumber(selector: string): Promise<number> {
        const val = await this.GetText(selector);
        return val !== '' ? Number(val) : 0;
    };

    public async GetScrambleInfos(): Promise<PagesInfos> {
        return {
            //Width: await this.GetNumber('ContentFrame > Width'),
            //Height: await this.GetNumber('ContentFrame > Height'),
            ContentType: await this.GetNumber('ContentType'),
            // BgColor: {
            //     Red: await this.GetNumber('BgColor > Red'),
            //      Green: await this.GetNumber('BgColor > Green'),
            //      Blue: await this.GetNumber('BgColor > Blue'),
            //   },
            TotalPage: await this.GetNumber('TotalPage'),
            // Version: await this.GetText('Version'),
            // Guid: await this.GetText('Guid'),
            NumColumns: await this.GetNumber('Scramble > Width'),
            NumRows: await this.GetNumber('Scramble > Height'),
        };
        // OptionId: await this.GetText('OptionId'),
    };

    public async GetImageInfos(): Promise<ImageInfos> {
        const xmlDoc = await this.#xml;

        const partElements = xmlDoc.querySelectorAll('Part');
        const parts: PartData[] = Array.from(partElements).map(partEl => {
            const kindEl = partEl.querySelector('Kind');
            return {
                type: kindEl?.textContent ? Number(kindEl.textContent.trim()) : PartType.DATA_TYPE_JPEG,
                scramble: kindEl?.getAttribute('scramble') === '1',
                number: Number(kindEl?.getAttribute('No') || 0),
            };
        });

        const scrambleRaw = await this.GetText('Scramble');
        const scrambleArray = scrambleRaw !== '' ? scrambleRaw.split(',').map(item => Number(item.trim())) : [];

        return {
            PageIndex: await this.GetNumber('PageNo'),
            /*BgColor: {
                Red: await this.GetNumber('BgColor > Red'),
                Green: await this.GetNumber('BgColor > Green'),
                Blue: await this.GetNumber('BgColor > Blue'),
            },
            Sheet: {
                X: await this.GetNumber('Sheet > X'),
                Y: await this.GetNumber('Sheet > Y'),
            },
            PartCount: await this.GetNumber('PartCount'),
            TotalPartSize: await this.GetNumber('TotalPartSize'),*/
            Parts: parts,
            StepRect: {
                //X: await this.GetNumber('StepRect > X'),
                //Y: await this.GetNumber('StepRect > Y'),
                Width: await this.GetNumber('StepRect > Width'),
                Height: await this.GetNumber('StepRect > Height'),
            },
            //StepCount: await this.GetNumber('StepCount'),
            ScrambleArray: scrambleArray,
        };
    }

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
        dom.querySelectorAll<HTMLInputElement>('div#meta input').forEach(({ name, value }) => metadatas.set(name, value));
        authkey = metadatas.get('param');
        endpoint = metadatas.get('cgi');
    }

    const url = new URL(endpoint, this.URI);
    url.searchParams.set('mode', Modes.MODE_DL_FACE_XML);
    url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
    url.searchParams.set('vm', '4');
    url.searchParams.set('file', 'face.xml');
    url.searchParams.set('param', authkey);

    const faceData = await new XMLDeserializer(new Request(url)).GetScrambleInfos();

    for (let i = 0; i < faceData.TotalPage; i++) {
        const pagename = i.toString().padStart(4, '0') + '.xml';
        const url = new URL(endpoint, this.URI);
        url.searchParams.set('mode', Modes.MODE_DL_PAGE_XML);
        url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
        url.searchParams.set('vm', '4');
        url.searchParams.set('file', pagename);
        url.searchParams.set('param', authkey);
        pages.push(new Page<PagesInfos>(this, chapter, url, { ...faceData }));
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
export async function FetchImageAjax(this: MangaScraper, page: Page<PagesInfos>, priority: Priority, signal: AbortSignal): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        try {

            const { NumColumns, NumRows } = page.Parameters;

            const endpoint = page.Link.origin + page.Link.pathname;
            const authkey = page.Link.searchParams.get('param');

            const { PageIndex, Parts, ScrambleArray, StepRect: { Width, Height } } = await new XMLDeserializer(new Request(page.Link)).GetImageInfos();

            return DeScramble(new ImageData(Width, Height), async (_, ctx) => {

                for (const part of Parts) {
                    switch (part.type) {
                        case PartType.DATA_TYPE_JPEG:
                        case PartType.DATA_TYPE_GIF:
                        case PartType.DATA_TYPE_PNG:
                        case PartType.DATA_TYPE_LESIA:
                        case PartType.DATA_TYPE_LESIA_OLD: {

                            const partFileName = [`${PageIndex}`.padStart(4, '0'), `${part.number}`.padStart(4, '0')].join('_') + '.bin';
                            const imageUrl = new URL(endpoint);
                            const type = part.type === PartType.DATA_TYPE_LESIA || part.type === PartType.DATA_TYPE_LESIA_OLD
                                ? part.type
                                : PartType.DATA_TYPE_JPEG;
                            imageUrl.searchParams.set('mode', `${type}`);
                            imageUrl.searchParams.set('file', partFileName);
                            imageUrl.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
                            imageUrl.searchParams.set('param', authkey);

                            const image = await LoadImage(imageUrl, part);

                            if (image) {

                                if (part.scramble) {

                                    const pieceWidth = 8 * Math.floor(Math.floor(image.width / NumColumns) / 8);
                                    const pieceHeight = 8 * Math.floor(Math.floor(image.height / NumRows) / 8);

                                    if (!(ScrambleArray.length < NumColumns * NumRows || image.width < 8 * NumColumns || image.height < 8 * NumRows)) {
                                        for (let scrambleIndex = 0; scrambleIndex < ScrambleArray.length; scrambleIndex++) {
                                            const pieceX = scrambleIndex % NumColumns * pieceWidth;
                                            const pieceY = Math.floor(scrambleIndex / NumColumns) * pieceHeight;
                                            const p = ScrambleArray[scrambleIndex];
                                            const sourceX = p % NumColumns * pieceWidth;
                                            const sourceY = Math.floor(p / NumColumns) * pieceHeight;
                                            ctx.clearRect(pieceX, pieceY, pieceWidth, pieceHeight);
                                            ctx.drawImage(image, sourceX, sourceY, pieceWidth, pieceHeight, pieceX, pieceY, pieceWidth, pieceHeight);
                                        }
                                    }
                                } else ctx.drawImage(image, 0, 0);

                                image.close();
                            } else throw new Error('Binary image not supported !');
                            break;
                        }
                    }
                }

            });
        } catch (error) {
            throw error;
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
            public async FetchImage(this: MangaScraper, page: Page<PagesInfos>, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal);
            }
        };
    };
}

async function LoadImage(url: URL, partData: PartData): Promise<ImageBitmap> {
    if (partData.type === PartType.DATA_TYPE_LESIA || partData.type === PartType.DATA_TYPE_LESIA_OLD) {
        throw new Error('Binary part not supported');
    }

    try {
        const response = await Fetch(new Request(url));
        const blob = await response.blob();
        return await createImageBitmap(blob);
    } catch (error) {
        throw error;
    }
}