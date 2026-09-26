import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import DeScramble from '../../transformers/ImageDescrambler';
import { GetTypedData } from './Common';
import { GetBytesFromBase64 } from '../../BufferEncoder';

type JSONPageData = {
    items: ContentConfiguration[];
};

type ContentConfiguration = {
    ContentID: string;
    ctbl: string | string[];
    ptbl: string | string[];
    ServerType: number | string;
    ContentsServer: string;
    p: string;
    ViewMode: number;
    ContentDate: string;
};

type JSONImageData = {
    resources: {
        i: {
            src: string;
        };
    };
    views: View[];
};

type View = {
    coords: string[];
    width: number;
    height: number;
};

type PageViewv016130 = {
    transfers: {
        index: number;
        coords: DrawImageCoords[];
    }[];
    width: number;
    height: number;
};

type DrawImageCoords = {
    height: number;
    width: number;
    xdest: number;
    xsrc: number;
    ydest: number;
    ysrc: number;
};

type SBCDATA = {
    ttx: string;
};

type DescrambleKP = {
    s: string;
    u: string;
};

type Dimensions = {
    width: number;
    height: number;
};

type Piece = {
    x: number;
    y: number;
    w: number;
    h: number;
};

interface Descrambler {
    IsValid(): boolean;
    GetDimensions(dimensions: Dimensions): Dimensions;
    GetCoords(dimensions: Dimensions): DrawImageCoords[];
}

const JsonFetchScript = `
    new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('{URI}');
            const json = await response.json();
            resolve(json);
        } catch (error) {
            reject(error);
        }
    })
`;

export enum SpeedBindVersion { v016061, v016452, v016201, v016130 };

function GetSanitizedURL(base: string, append: string): URL {
    const baseURI = new URL(append, base + '/');
    baseURI.pathname = baseURI.pathname.replaceAll(/\/\/+/g, '/');
    return baseURI;
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param version - SpeedBinb version used by the website
 * @param needCookies - Use browser window to perform first JSON request to get access cookies properly
 */
export async function FetchPagesSinglePageAjax(this: MangaScraper, chapter: Chapter, version: SpeedBindVersion, needCookies = false): Promise<Page[]> {

    //1 Fetch "div#content.pages" and "real" chapter url (since a redirection is possible)
    let viewerUrl = new URL(chapter.Identifier, this.URI);
    const response = await Fetch(new Request(viewerUrl, {
        headers: {
            Referer: this.URI.href
        }
    }));

    const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
    const SBHtmlElement = dom.querySelector<HTMLElement>('div#content.pages');
    //handle redirection. Sometimes chapter is redirected
    if (response.redirected) {
        viewerUrl = new URL(response.url);
    }

    //easy mode : pages are just an array of div
    if (version == SpeedBindVersion.v016061) {
        //Kirapo, ComicPorta, Kimicomi, MichiKusa, OneTwoThreeHon, TKSuperheroComics
        const [...imageConfigurations] = SBHtmlElement.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]');
        return imageConfigurations.map(({ dataset }) => new Page(this, chapter, new URL(dataset.ptimg, viewerUrl)));
    }

    //2 Gather all informations using viewerUrl and SBHtmlElement (cid, sharingkey, dmytime, u0, u1, configuration)
    let cid = viewerUrl.searchParams.get('cid') ?? SBHtmlElement.dataset.ptbinbCid;

    //in case cid is not in url and not in html, try to get it from page redirected by Javascript/ Meta
    if (!cid) {
        cid = await FetchWindowScript<string>(new Request(viewerUrl), 'new URL(window.location).searchParams.get("cid");', 5000);
    }
    if (!cid) throw new Error('Unable to find CID (content ID) !');

    const sharingKey = ComputeSharingKey(cid);
    const uri = GetSanitizedURL(viewerUrl.href, SBHtmlElement.dataset.ptbinb);
    const dmytime = `${Date.now()}`;
    uri.searchParams.set('cid', cid);
    uri.searchParams.set('dmytime', dmytime);
    uri.searchParams.set('k', sharingKey);

    const u0 = viewerUrl.searchParams.get('u0');
    const u1 = viewerUrl.searchParams.get('u1');
    if (u0) uri.searchParams.set('u0', u0);
    if (u1) uri.searchParams.set('u1', u1);

    const { items } = !needCookies ? await FetchJSON<JSONPageData>(new Request(uri, {
        headers: {
            Referer: viewerUrl.href
        }
    })) :
        await FetchWindowScript<JSONPageData>(new Request(viewerUrl), JsonFetchScript.replace('{URI}', uri.href), 2000);

    //3 Fetch pages links using speedbinb informations
    const configuration = items.at(0);
    cid = version === SpeedBindVersion.v016452 ? cid : configuration.ContentID;
    configuration.ctbl = ComputeTable(cid, sharingKey, configuration.ctbl as string);
    configuration.ptbl = ComputeTable(cid, sharingKey, configuration.ptbl as string);
    try {
        configuration.ServerType = parseInt(configuration.ServerType as string);
    } catch { }

    switch (configuration.ServerType as number) {
        case 0: { //v016130 ShukanManga , v016452 CMOA
            //Fix for ShukanManga that has only got a path in ContentsServer
            if (!configuration.ContentsServer.startsWith('http')) configuration.ContentsServer = new URL(configuration.ContentsServer, viewerUrl).href;

            const uri = GetSanitizedURL(configuration.ContentsServer, 'sbcGetCntnt.php');
            uri.searchParams.set('cid', cid);
            uri.searchParams.set('dmytime', configuration.ContentDate);
            uri.searchParams.set('p', configuration.p);
            uri.searchParams.set('vm', `${configuration.ViewMode}`);
            if (version === SpeedBindVersion.v016452) { //CMOA
                uri.searchParams.set('q', '1');
                uri.searchParams.set('u0', u0);
                uri.searchParams.set('u1', u1);
            }
            return await ExtractPages.call(this, uri, '/sbcGetCntnt.php', 'sbcGetImg.php', configuration, chapter);
        }

        case 1: {//v016130 Futabanet, BookHodai, Booklive, OhtaBooks, SManga
            const uri = GetSanitizedURL(configuration.ContentsServer, 'content.js');
            if (configuration.ContentDate) uri.searchParams.set('dmytime', configuration.ContentDate);
            return await ExtractPages.call(this, uri, '/content.js', '{src}/M_H.jpg', configuration, chapter);
        }
        case 2: {//v016130 MangaPlaza, Yanmaga, Yomonga
            const uri = GetSanitizedURL(configuration.ContentsServer, 'content');
            if (configuration.ContentDate) uri.searchParams.set('dmytime', configuration.ContentDate);
            if (u0) uri.searchParams.set('u0', u0);
            if (u1) uri.searchParams.set('u1', u1);
            return await ExtractPages.call(this, uri, '/content', 'img/{src}', configuration, chapter);
        }
    }
    return Promise.reject(new Error('Content server type not supported!'));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter from a website using SpeedBinb Viewer.
 * @param version - SpeedBinb version used by the website
 * @param needCookies - Use browser window to perform first JSON request to get access cookies properly
 */

export function PagesSinglePageAjax(version: SpeedBindVersion = SpeedBindVersion.v016061, needCookies = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAjax.call(this, chapter, version, needCookies);
            }
        };
    };
}

async function ExtractPages(this: MangaScraper, uri: URL, replaceFrom: string, replaceto: string, configuration: ContentConfiguration, chapter: Chapter): Promise<Page[]> {
    const response = await Fetch(new Request(uri, {
        // credentials: 'include',
        headers: {
            Referer: this.URI.href,
        }
    }));
    const data = await response.text();
    const { ttx }: SBCDATA = data.startsWith('DataGet_Content(') ? JSON.parse(data.slice(16, -1)) : JSON.parse(data);
    const dom = new DOMParser().parseFromString(ttx, 'text/html');
    const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
        let src = img.getAttribute('src');

        const pageUri = new URL(uri);
        pageUri.hash = window.btoa(JSON.stringify(GetDescrambleKeyPair(src, configuration.ctbl as string[], configuration.ptbl as string[])));

        if (!/{src}/.test(replaceto)) {
            pageUri.searchParams.set('src', src);
        }
        pageUri.pathname = pageUri.pathname.replace(/[^\/]+$/, replaceto.replace('{src}', src));
        return new Page(this, chapter, pageUri);

    });
    return pageLinks;
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
export async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    switch (true) {
        case page.Link.href.endsWith('ptimg.json'): {
            // descramble_v016061
            return this.imageTaskPool.Add(async () => {
                //Fetch JSON
                const { resources: { i: { src } }, views } = await FetchJSON<JSONImageData>(new Request(page.Link));
                //Fetch IMAGE
                const response = await Fetch(new Request(new URL(src, page.Link.href), {
                    signal,
                    headers: {
                        'Referer': page.Parameters?.Referer ?? page.Link.origin,
                    }
                }));
                const blob = detectMimeType ? await GetTypedData(await response.arrayBuffer()) : await response.blob();
                return DeScramble(blob, async (image, ctx) => {
                    for (const part of views.at(0).coords) {
                        const [, sourceX, sourceY, partWidth, partHeight, targetX, targetY] = part.split(/[:,+>]/).map(num => parseInt(num));
                        ctx.drawImage(image, sourceX, sourceY, partWidth, partHeight, targetX, targetY, partWidth, partHeight);
                    }
                });
            }, priority, signal);
        }

        case page.Link.href.includes('sbcGetImg'):
        case page.Link.href.includes('M_L.jpg'):
        case page.Link.href.includes('M_H.jpg'):
        case page.Link.href.includes('/img/'): { //descramble_v016130

            const blob: Blob = await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType);
            const { s, u }: DescrambleKP = JSON.parse(new TextDecoder().decode(GetBytesFromBase64(page.Link.hash.slice(1))));
            return DeScramble(blob, async (image, ctx) => {
                const view = GetImageDescrambleCoords(s, u, image.width, image.height);
                for (const part of view.transfers[0].coords) {
                    ctx.drawImage(image, part.xsrc, part.ysrc, part.width, part.height, part.xdest, part.ydest, part.width, part.height);
                }
            });
        }

    }
    throw new Error('Unsupported version of SpeedBinb reader!');
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
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}

/**
 * Compute a sharing key from a content ID (cid) (_tt speedbinb function)
 * @param cid - The content ID string
 * @returns - The generated sharing key
 */
function ComputeSharingKey(cid: string): string {
    const timestampHex = Date.now().toString(16).padStart(16, 'x');

    // Repeat the cid enough times to fill a 16-character length
    const repeatedCid = cid.repeat(Math.ceil(16 / cid.length) + 1);
    const prefixCid = repeatedCid.substring(0, 16);
    const suffixCid = repeatedCid.substring(repeatedCid.length - 16);

    let charCodeA = 0;
    let charCodeB = 0;
    let charCodeC = 0;

    const base64UrlAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    return timestampHex.split('').map((currentChar, index) => {
        charCodeA ^= timestampHex.charCodeAt(index);
        charCodeB ^= prefixCid.charCodeAt(index);
        charCodeC ^= suffixCid.charCodeAt(index);

        const combinedIndex = charCodeA + charCodeB + charCodeC & 63;
        return currentChar + base64UrlAlphabet[combinedIndex];
    }).join('');
}

//SpeedBinb "_pt" function
function ComputeTable(keyPart1: string, keyPart2: string, payload: string): string[] {
    const combinedKey = `${keyPart1}:${keyPart2}`;
    let seed = 0;

    // Generate a numeric seed from the combined key
    for (let i = 0; i < combinedKey.length; i++) {
        seed += combinedKey.charCodeAt(i) << i % 16;
    }

    // Apply a 31-bit bitwise mask and handle zero edge-cases
    seed &= 2147483647;
    if (seed === 0) {
        seed = 305419896;
    }

    let decodedString = '';
    let currentHash = seed;

    // Transform each character of the payload using a pseudo-random shift
    for (let i = 0; i < payload.length; i++) {
        currentHash = currentHash >>> 1 ^ 1210056708 & -(currentHash & 1);
        const charCode = (payload.charCodeAt(i) - 32 + currentHash) % 94 + 32;
        decodedString += String.fromCharCode(charCode);
    }

    try {
        return JSON.parse(decodedString);
    } catch {
        return null;
    }
}

/**
 * Determine which descramble key pair from ctbl / ptbl shall be used
 * depending on the given image name  'pages/cu77gvXE.jpg'
 * old function name : lt_001
 */
function GetDescrambleKeyPair(imageName: string, ctbl: string[], ptbl: string[]): DescrambleKP {
    if (!imageName) {
        return { s: ptbl[0], u: ctbl[0] };
    }

    // Extract the filename portion after the last slash
    const lastSlashIndex = imageName.lastIndexOf("/");
    const filename = imageName.slice(lastSlashIndex + 1);

    let sumEven = 0;
    let sumOdd = 0;

    // Sum character codes, separating even and odd character positions
    for (let i = 0; i < filename.length; i++) {
        const charCode = filename.charCodeAt(i);
        if (i % 2 === 0) {
            sumEven += charCode;
        } else {
            sumOdd += charCode;
        }
    }

    // Map sums to indices within the 0-7 range
    const ptblIndex = sumEven % 8;
    const ctblIndex = sumOdd % 8;

    return { s: ptbl[ptblIndex], u: ctbl[ctblIndex] };
}

/**
 * /**
 * Copied from official SpeedBinb library
 * t  imagecontext containing src property ('pages/cu77gvXE.jpg')
 * @param sKey - first descrambling key (s)
 * @param uKey - second descrambing key (u)
 * @param width - width of descrambled image
 * @param height - height of descrambled image
 */
function GetImageDescrambleCoords(/*t*/sKey: string, uKey: string, width: number, height: number): PageViewv016130 {
    const descrambler = GetDescrambler(sKey, uKey); // var r = this.lt(t.src);
    if (!descrambler || !descrambler.IsValid())
        return null;
    const dimensions = descrambler.GetDimensions({ width, height });
    return {
        width: dimensions.width,
        height: dimensions.height,
        transfers: [{
            index: 0,
            coords: descrambler.GetCoords({
                width,
                height
            })
        }]
    };
}

/**
 * Get a descrambler based on the descramble key pair from ctbl / ptbl
 * old function named _lt_002
 * @param sKey - first descrambling key (s)
 * @param uKey - second descrambing key (u)
 */
function GetDescrambler(sKey: string, uKey: string): Descrambler {
    return uKey.startsWith('=') && sKey.startsWith('=') ? new SpeedBinbF(uKey, sKey) :
        uKey.match(/^[0-9]/) && sKey.match(/^[0-9]/) ? new SpeedBinbA(uKey, sKey) :
            uKey === '' && sKey === '' ? new SpeedbinbH : null;
}

class SpeedBinbF implements Descrambler {
    // Mapping array for scrambled image chunks, or null if invalid
    private mappingTable: number[] | null = null;

    private columns: number;
    private rows: number;
    private padding: number;
    private sourceXCoords: number[];
    private sourceYCoords: number[];
    private targetXCoords: number[];
    private targetYCoords: number[];

    // Lookup table for decoding layout strings
    private static readonly DECODE_TABLE: number[] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ];

    constructor(uKey: string, sKey: string) {
        const keyPattern = /^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/;
        const uMatch = uKey.match(keyPattern);
        const sMatch = sKey.match(keyPattern);

        const isValidKeys =
            uMatch !== null &&
            sMatch !== null &&
            uMatch[1] === sMatch[1] &&
            uMatch[2] === sMatch[2] &&
            uMatch[4] === sMatch[4] &&
            uMatch[3] === "+" &&
            sMatch[3] === "-";

        if (isValidKeys) {
            this.columns = parseInt(uMatch[1], 10);
            this.rows = parseInt(uMatch[2], 10);
            this.padding = parseInt(uMatch[4], 10);

            const dimensionsValid = this.columns <= 8 && this.rows <= 8 && this.columns * this.rows <= 64;

            if (dimensionsValid) {
                const expectedLength = this.columns + this.rows + this.columns * this.rows;

                if (uMatch[5].length === expectedLength && sMatch[5].length === expectedLength) {
                    const uLayout = this.#ParseLayout(uMatch[5]);
                    const sLayout = this.#ParseLayout(sMatch[5]);

                    this.sourceXCoords = uLayout.xCoords;
                    this.sourceYCoords = uLayout.yCoords;
                    this.targetXCoords = sLayout.xCoords;
                    this.targetYCoords = sLayout.yCoords;
                    this.mappingTable = [];

                    for (let i = 0; i < this.columns * this.rows; i++) {
                        this.mappingTable.push(uLayout.positions[sLayout.positions[i]]);
                    }
                }
            }
        }
    }

    public IsValid(): boolean {
        return this.mappingTable !== null;
    }

    #ValidateDimensions(dimensions: Dimensions): boolean {
        const minWidth = 64 + 2 * this.columns * this.padding;
        const minHeight = 64 + 2 * this.rows * this.padding;
        const minArea = (320 + 2 * this.columns * this.padding) * (320 + 2 * this.rows * this.padding);

        const widthMatch = dimensions.width >= minWidth;
        const heightMatch = dimensions.height >= minHeight;
        const areaMatch = dimensions.width * dimensions.height >= minArea;

        return widthMatch && heightMatch && areaMatch;
    }

    public GetDimensions(dimensions: Dimensions): Dimensions {
        if (!this.#ValidateDimensions(dimensions)) {
            return dimensions;
        }

        return {
            width: dimensions.width - 2 * this.columns * this.padding,
            height: dimensions.height - 2 * this.rows * this.padding
        };
    }

    public GetCoords(dimensions: Dimensions): DrawImageCoords[] | null {
        if (!this.IsValid()) return null;

        if (!this.#ValidateDimensions(dimensions)) {
            return [{
                xsrc: 0,
                ysrc: 0,
                width: dimensions.width,
                height: dimensions.height,
                xdest: 0,
                ydest: 0
            }];
        }

        const coordsList: DrawImageCoords[] = [];
        const netWidth = dimensions.width - 2 * this.columns * this.padding;
        const netHeight = dimensions.height - 2 * this.rows * this.padding;

        const cellWidth = Math.floor((netWidth + this.columns - 1) / this.columns);
        const extraWidth = netWidth - (this.columns - 1) * cellWidth;

        const cellHeight = Math.floor((netHeight + this.rows - 1) / this.rows);
        const extraHeight = netHeight - (this.rows - 1) * cellHeight;

        for (let i = 0; i < this.columns * this.rows; ++i) {
            const colIndex = i % this.columns;
            const rowIndex = Math.floor(i / this.columns);

            const targetXCheck = this.targetXCoords[rowIndex] < colIndex ? extraWidth - cellWidth : 0;
            const srcX = this.padding + colIndex * (cellWidth + 2 * this.padding) + targetXCheck;

            const targetYCheck = this.targetYCoords[colIndex] < rowIndex ? extraHeight - cellHeight : 0;
            const srcY = this.padding + rowIndex * (cellHeight + 2 * this.padding) + targetYCheck;

            const mappedTarget = this.mappingTable![i];
            const targetCol = mappedTarget % this.columns;
            const targetRow = Math.floor(mappedTarget / this.columns);

            const sourceXCheck = this.sourceXCoords[targetRow] < targetCol ? extraWidth - cellWidth : 0;
            const destX = targetCol * cellWidth + sourceXCheck;

            const sourceYCheck = this.sourceYCoords[targetCol] < targetRow ? extraHeight - cellHeight : 0;
            const destY = targetRow * cellHeight + sourceYCheck;

            const finalWidth = this.targetXCoords[rowIndex] === colIndex ? extraWidth : cellWidth;
            const finalHeight = this.targetYCoords[colIndex] === rowIndex ? extraHeight : cellHeight;

            if (netWidth > 0 && netHeight > 0) {
                coordsList.push({
                    xsrc: srcX,
                    ysrc: srcY,
                    width: finalWidth,
                    height: finalHeight,
                    xdest: destX,
                    ydest: destY
                });
            }
        }

        return coordsList;
    }

    #ParseLayout(layoutStr: string) {
        const yCoords: number[] = [];
        const xCoords: number[] = [];
        const positions: number[] = [];

        for (let i = 0; i < this.columns; i++) {
            yCoords.push(SpeedBinbF.DECODE_TABLE[layoutStr.charCodeAt(i)]);
        }

        for (let i = 0; i < this.rows; i++) {
            xCoords.push(SpeedBinbF.DECODE_TABLE[layoutStr.charCodeAt(this.columns + i)]);
        }

        for (let i = 0; i < this.columns * this.rows; i++) {
            positions.push(SpeedBinbF.DECODE_TABLE[layoutStr.charCodeAt(this.columns + this.rows + i)]);
        }

        return {
            yCoords,
            xCoords,
            positions
        };
    }
}

/**
 * Copied from official SpeedBinb library
 * Converted to a modern TypeScript class
 */
class SpeedBinbA implements Descrambler {
    private layoutA: any = null;
    private layoutB: any = null;

    constructor(uKey: string, sKey: string) {
        const layout1 = this.#ParseLayout(uKey);
        const layout2 = this.#ParseLayout(sKey);
        if (layout1 && layout2 && layout1.ndx === layout2.ndx && layout1.ndy === layout2.ndy) {
            this.layoutA = layout1;
            this.layoutB = layout2;
        }
    }

    public IsValid(): boolean {
        return null !== this.layoutA && null !== this.layoutB;
    }

    #ValidateDimensions(dimensions: Dimensions): boolean {
        return 64 <= dimensions.width && 64 <= dimensions.height && 102400 <= dimensions.width * dimensions.height;
    }

    public GetDimensions(dimensions: Dimensions): Dimensions {
        return dimensions;
    }

    public GetCoords(dimensions: Dimensions): DrawImageCoords[] | null {
        if (!this.IsValid())
            return null;

        const coordinatesList: DrawImageCoords[] = [];
        const scaledWidth = dimensions.width - dimensions.width % 8;
        const columnStep = Math.floor((scaledWidth - 1) / 7) - Math.floor((scaledWidth - 1) / 7) % 8;
        const remainderWidth = scaledWidth - 7 * columnStep;
        const scaledHeight = dimensions.height - dimensions.height % 8;
        const rowStep = Math.floor((scaledHeight - 1) / 7) - Math.floor((scaledHeight - 1) / 7) % 8;
        const remainderHeight = scaledHeight - 7 * rowStep;
        const pieceCount = this.layoutA.piece.length;

        if (!this.#ValidateDimensions(dimensions))
            return [{
                xsrc: 0,
                ysrc: 0,
                width: dimensions.width,
                height: dimensions.height,
                xdest: 0,
                ydest: 0
            }];

        for (let index = 0; index < pieceCount; index++) {
            const pieceA = this.layoutA.piece[index];
            const pieceB = this.layoutB.piece[index];
            coordinatesList.push({
                xsrc: Math.floor(pieceA.x / 2) * columnStep + pieceA.x % 2 * remainderWidth,
                ysrc: Math.floor(pieceA.y / 2) * rowStep + pieceA.y % 2 * remainderHeight,
                width: Math.floor(pieceA.w / 2) * columnStep + pieceA.w % 2 * remainderWidth,
                height: Math.floor(pieceA.h / 2) * rowStep + pieceA.h % 2 * remainderHeight,
                xdest: Math.floor(pieceB.x / 2) * columnStep + pieceB.x % 2 * remainderWidth,
                ydest: Math.floor(pieceB.y / 2) * rowStep + pieceB.y % 2 * remainderHeight
            });
        }

        const totalWidthCalculated = columnStep * (this.layoutA.ndx - 1) + remainderWidth;
        const totalHeightCalculated = rowStep * (this.layoutA.ndy - 1) + remainderHeight;

        if (totalWidthCalculated < dimensions.width) {
            coordinatesList.push({
                xsrc: totalWidthCalculated,
                ysrc: 0,
                width: dimensions.width - totalWidthCalculated,
                height: totalHeightCalculated,
                xdest: totalWidthCalculated,
                ydest: 0
            });
        }

        if (totalHeightCalculated < dimensions.height) {
            coordinatesList.push({
                xsrc: 0,
                ysrc: totalHeightCalculated,
                width: dimensions.width,
                height: dimensions.height - totalHeightCalculated,
                xdest: 0,
                ydest: totalHeightCalculated
            });
        }

        return coordinatesList;
    }

    #ParseLayout(layoutString: string) {
        if (!layoutString) return null;

        const parts = layoutString.split("-");
        if (3 != parts.length) return null;

        const columns = parseInt(parts[0], 10);
        const rows = parseInt(parts[1], 10);
        const encodedData = parts[2];

        if (encodedData.length != columns * rows * 2)
            return null;

        const pieces: Piece[] = [];
        const limitA = (columns - 1) * (rows - 1) - 1;
        const limitB = limitA + (columns - 1);
        const limitC = limitB + (rows - 1);
        const limitD = limitC + 1;

        for (let pieceIndex = 0; pieceIndex < columns * rows; pieceIndex++) {
            const charX = this.#GetCharValue(encodedData.charAt(2 * pieceIndex));
            const charY = this.#GetCharValue(encodedData.charAt(2 * pieceIndex + 1));

            let widthVal = 0, heightVal = 0;

            if (pieceIndex <= limitA) {
                heightVal = widthVal = 2;
            } else if (pieceIndex <= limitB) {
                widthVal = 2;
                heightVal = 1;
            } else if (pieceIndex <= limitC) {
                widthVal = 1;
                heightVal = 2;
            } else if (pieceIndex <= limitD) {
                heightVal = widthVal = 1;
            }

            pieces.push({
                x: charX,
                y: charY,
                w: widthVal,
                h: heightVal
            });
        }

        return {
            ndx: columns,
            ndy: rows,
            piece: pieces
        };
    }

    #GetCharValue(t: string): number {
        const upperIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(t);
        if (upperIndex !== -1) {
            return 1 + 2 * upperIndex; // Maps to odd numbers
        }

        const lowerIndex = "abcdefghijklmnopqrstuvwxyz".indexOf(t);
        if (lowerIndex !== -1) {
            return 2 * lowerIndex;// Maps to even numbers
        }
        return -1;
    }
}

class SpeedbinbH implements Descrambler {
    public IsValid(): boolean {
        return true;
    }

    #ValidateDimensions(): boolean {
        return false;
    }

    public GetDimensions(t: Dimensions): Dimensions {
        return t;
    }

    public GetCoords(t: Dimensions): DrawImageCoords[] {
        return [{
            xsrc: 0,
            ysrc: 0,
            width: t.width,
            height: t.height,
            xdest: 0,
            ydest: 0
        }];
    }
}