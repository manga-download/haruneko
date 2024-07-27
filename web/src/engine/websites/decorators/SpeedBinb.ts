import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import DeScramble from '../../transformers/ImageDescrambler';

type JSONPageDatav016452 = {
    items: Configurationv016452[]
}

type Configurationv016452 = {
    ContentID: string,
    ctbl: string | string[],
    ptbl: string | string[],
    ServerType: number | string
    ContentsServer: string,
    p: string,
    ViewMode: number,
    ContentDate: string
}

type Paramsv016452 = {
    cid: string,
    u0: string,
    u1: string,
    sharingKey: string
}

type JSONImageDatav016061 = {
    resources: {
        i: {
            src: string
        }
    }
    views: PageViewv016061[]
}
type PageViewv016061 = {
    coords: string[],
    width: number,
    height: number
}

type PageViewv016130 = {
    transfers: {
        index: number,
        coords: DrawImageCoords[]
    }[],
    width: number,
    height: number
}

type DrawImageCoords = {
    height: number,
    width: number,
    xdest: number,
    xsrc: number,
    ydest: number,
    ysrc: number
}

type SBCDATA = {
    ttx: string;
}

type DescrambleKP = {
    s: string,
    u: string
}

type Dimensions = {
    width: number,
    height: number
}

const JsonFetchScript = `
        new Promise(resolve => {
            fetch('{URI}')
                .then(response => response.json())
                .then(json => resolve(json))
         });
`;
export enum SpeedBinbVersion { v016113 = 1, v016201, v016452, v016130, _default_v016061, vUnknown }
function getSanitizedURL(base: string, append: string): URL {
    const baseURI = new URL(append, base + '/');
    baseURI.pathname = baseURI.pathname.replaceAll(/\/\/+/g, '/');
    return baseURI;

}

function getSpeedBinbVersion(el: HTMLElement, viewerUrl: URL): SpeedBinbVersion {
    //Comic Brise, Comic Meteor, Comic Polaris, Comic Valkyrie, Digital MargaRet, OneTwoThreeHon : _default_v016061
    //(el.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]')

    /*CMOA :v016452
    ptbinb : "/bib/sws/bibGetCntntInfo.php?u0=1&u1=0" U0 U1
    ptbinbCid : "0000151961_jp_0001"
    'https://www.cmoa.jp/bib/speedreader/?cid=0000151961_jp_0001&u0=1&u1=0' U0 U1 CID

    BOOKHODAI :v016113 / v016130
    ptbinb "https://viewer.bookhodai.jp/sws/apis/bibGetCntntInfo.php?s=1&u0=8bec5433d58929b4ab4b5a07398fff33&u1=4554f324862d187e7c9d27c85e1d8d84" UO U1
    ptbinbCid "300010065401"
    'https://viewer.bookhodai.jp/speedreader/main.php?cid=300010065401&u0=8bec5433d58929b4ab4b5a07398fff33&u1=4554f324862d187e7c9d27c85e1d8d84&rurl=https%3A%2F%2Fbookhodai.jp%2F&member_id=0' U0 U1 CID

    BOOKLIVE :v016113 / v016130
    ptbinb : "/bib-api/bibGetCntntInfo" NOTHING
    ptbinbCid: "60114561_001"
    'https://booklive.jp/bviewer/s/?cid=60114561_001' CID

    FUTBANET :v016113 / v016130
    ptbinb: "/sws/bibGetCntntInfo?hash=60ebb4277765619176000000&display_order=1" NOTHING
    ptbinbCid: "60ebb4277765619176000000_001-001_1"
    https://gaugau.futabanet.jp/list/work/60ebb4277765619176000000/episodes/1 NOTHING

    GETSUAKU :v016113 / v016130
    ptbinb: "../sws/bibGetCntntInfo" NOTHING
    ptbinbCid: "001_gaw_makinasan"
    https://getsuaku.com/episode/001_gaw_makinasan' NOTHING

    ManpaPlanet :v016113 / v016130
    ptbinb : "https://mangaplanet.com/sws/apis/bibGetCntntInfo.php NOTHING
    'https://mangaplanet.com/reader?cid=64c77843994e3' CID

    ManpaPlaza :v016113 / v016130
    ptbinb: "/sws/apis/bibGetCntntInfo.php?u0=0&u1=https%3A%2F%2Fmangaplaza.com%2Ftitle%2F0303001706%2F%3Forder%3Ddown%26content_id%3D103030017060001" U0 U1
    ptbinbCid: "103030017060001"
    'https://reader.mangaplaza.com/speedreader/?cid=103030017060001&u0=0&u1=https%3A%2F%2Fmangaplaza.com%2Ftitle%2F0303001706%2F%3Forder%3Ddown%26content_id%3D103030017060001' U0 U1

    OHTABOOK :v016113 / v016130
    ptbinb: "https://console.binb.bricks.pub/bibGetCntntInfo?u0=83605b7e01f64a70baeec6bfe102f043" U0
    ptbinbCid: "cbb2ef02-0210-4050-804d-406713f40f61_1677753204"
    'https://binb.bricks.pub/contents/cbb2ef02-0210-4050-804d-406713f40f61_1677753204/speed_reader' NOTHING

    S-MANGA: :v016113 / v016130
    ptbinb: "./sws/apis/bibGetCntntInfo.php" NOTHING
    ptbinbCid: "4088725093"
    https://www.s-manga.net/reader/main.php?cid=4088725093' CID

    YANMAGA : v016113 / v016130
    ptbinb: "/viewer/bibGetCntntInfo?type=comics" NOTHING
    ptbinbCid: "06A0000000000731237F"
    'https://yanmaga.jp/viewer/comics/%E5%A4%A2%E3%81%86%E3%81%A4%E3%81%A4%E3%81%AE%E8%8A%B1%E3%81%AE%E5%9C%92/351192c0f7d1cf3b88175f3d9dfae594?cid=06A0000000000731237F' CID

    YOUNGJUMP :v016201
    ptbinb :"/sws/apis/bibGetCntntInfo.php?u1=10001"  U1
    ptbinbCid: "101012340"
    https://www.youngjump.world/reader/reader.html?cid=101012340&u1=10001': CID U1
*/

    if (el.dataset['ptbinb'] && el.dataset['ptbinbCid']) {
        return SpeedBinbVersion.v016113;
    }

    if (el.dataset['ptbinb'] && el.dataset.ptbinb.includes('bibGetCntntInfo') && viewerUrl.searchParams.get('u0') && viewerUrl.searchParams.get('u1')) {
        return SpeedBinbVersion.v016452;
    }

    if (el.dataset['ptbinb'] && el.dataset.ptbinb.includes('bibGetCntntInfo') && viewerUrl.searchParams.get('u1')) {
        return SpeedBinbVersion.v016201;
    }

    if (el.dataset['ptbinb'] && el.dataset.ptbinb.includes('bibGetCntntInfo')) {
        return SpeedBinbVersion.v016130;
    }

    if (el.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]').length > 0) {
        return SpeedBinbVersion._default_v016061;
    }

    return SpeedBinbVersion.vUnknown;
}

const pageScript = `
    new Promise(resolve  => {
        resolve ( { location : window.location.href, pages : document.querySelector("div#content.pages")});
    });
`;

type PageScriptResult = {
    location: string,
    pages: HTMLElement
}
/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * A class decorator that adds the ability to extract all pages for a given chapter from a website using SpeedBinb Viewer.
 * @param useScript - use FetchWindowScript and not Fetch for first request
 * @param sbVersionOverride - Override SpeedBinb version detection
 */
export function PagesSinglePageAjaxV016061() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAjaxV016061.call(this, chapter);
            }
        };
    };
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * Supposed to be used when chapter JSON got div[data-ptimg$="ptimg.json"] and each one is a json to a page.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param useScript - use FetchWindowScript and not Fetch for first request
 * @param sbVersionOverride - Override SpeedBinb version detection
 */
export async function FetchPagesSinglePageAjaxV016061(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
    let viewerUrl = new URL(chapter.Identifier, this.URI);
    const request = new Request(viewerUrl, {
        headers: {
            Referer: this.URI.origin
        }
    });

    const response = await Fetch(request);
    const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
    const SBpagesElement = dom.querySelector<HTMLElement>('div#content.pages');
    //handle redirection. Sometimes chapter is redirected
    if (response.redirected) {
        viewerUrl = new URL(response.url);
    }

    const [...imageConfigurations] = SBpagesElement.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]');
    return imageConfigurations.map(element => new Page(this, chapter, getSanitizedURL(viewerUrl.href, element.dataset.ptimg)));
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param useScript - use FetchWindowScript and not Fetch for first request
 * @param sbVersionOverride - Override SpeedBinb version detection
 */
export async function FetchPagesSinglePageAjax(this: MangaScraper, chapter: Chapter, useScript = false, sbVersionOverride: SpeedBinbVersion = undefined): Promise<Page[]> {
    let viewerUrl = new URL(chapter.Identifier, this.URI);
    const request = new Request(viewerUrl, {
        headers: {
            Referer: this.URI.origin
        }
    });//referer needed for ManpaPlanet

    let SBpagesElement: HTMLElement = undefined;

    // Raw fetching Gives the most accurate version detection and it handle automatic redirection.
    // We dont use FetchCSS because we must know if request is redirected (302, 303) to get real url
    // Also, FetchWindowScript doesnt works with Referer, and sometimes Referer is mandatory (MangaPlanet)
    if (!useScript) {
        const response = await Fetch(request);
        const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
        const data = dom.querySelector<HTMLElement>('div#content.pages');
        //handle redirection. Sometimes chapter is redirected
        if (response.redirected) {
            viewerUrl = new URL(response.url);
        }
        SBpagesElement = data;
    } else {
        //Use this if chapter is redirected using javascript, or if it must be opened in a window to gather access Cookies (MangaPlaza)
        const data = await FetchWindowScript<PageScriptResult>(request, pageScript, 2500);
        if (!data.pages) return []; //chapter may be paywalled, no need to throw an error, so quit gracefully
        viewerUrl = new URL(data.location);
        SBpagesElement = data.pages;
    }

    const SBVersion = sbVersionOverride || getSpeedBinbVersion(SBpagesElement, viewerUrl);

    if (SBVersion == SpeedBinbVersion.v016113) {
        viewerUrl.searchParams.set('cid', SBpagesElement.dataset['ptbinbCid']);
    }

    //Handle _default_v016061 : there is no parameter at all
    //Comic Brise, Comic Meteor, Comic Polaris, Comic Valkyrie, Digital MargaRet, OneTwoThreeHon, TKSuperheroComics
    if (SBVersion == SpeedBinbVersion._default_v016061) {
        const [...imageConfigurations] = SBpagesElement.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]');
        return imageConfigurations.map(element => {
            return new Page(this, chapter, getSanitizedURL(viewerUrl.href, element.dataset.ptimg));
        });
    }

    const cid = viewerUrl.searchParams.get('cid');
    const sharingKey = _tt(cid);
    const uri = getSanitizedURL(viewerUrl.href, SBpagesElement.dataset.ptbinb);
    uri.searchParams.set('cid', cid);
    uri.searchParams.set('dmytime', String(Date.now()));
    uri.searchParams.set('k', sharingKey);

    switch (SBVersion) {
        case SpeedBinbVersion.v016113: //BookHodai,  Futabanet, Getsuaku (v016700), MangaPlaza, Ohtabooks
        case SpeedBinbVersion.v016130: { // Booklive, MangaPlanet, S-Manga, Yanmaga
            //Doing it like that because of cookies needed for Mangaplanet using viewerUrl on purpose because of CORS issues
            const data = await FetchWindowScript<JSONPageDatav016452>(new Request(viewerUrl), JsonFetchScript.replace('{URI}', uri.href), 2000);
            return await getPageLinks_v016130(this, data.items[0], sharingKey, chapter);
        }
        //YoungJump
        case SpeedBinbVersion.v016201: {
            const u = viewerUrl.searchParams.get('u1');
            uri.searchParams.set('u1', u);
            //Doing it like that because of cookies needed for YoungJump using viewerUrl on purpose because of CORS issues
            const data = await FetchWindowScript<JSONPageDatav016452>(new Request(viewerUrl), JsonFetchScript.replace('{URI}', uri.href), 2000);
            return await getPageLinks_v016201(this, data.items[0], sharingKey, u, chapter);
        }
        //Cmoa
        case SpeedBinbVersion.v016452: {
            const u0 = viewerUrl.searchParams.get('u0');
            const u1 = viewerUrl.searchParams.get('u1');
            uri.searchParams.set('u0', u0);
            uri.searchParams.set('u1', u1);
            const data = await FetchJSON<JSONPageDatav016452>(new Request(uri));
            const params: Paramsv016452 = { cid, sharingKey, u0, u1 };
            return await getPageLinks_v016452(this, data.items[0], params, chapter);
        }
    }

    throw new Error('Unsupported version of SpeedBinb reader!');
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter from a website using SpeedBinb Viewer.
 * @param useScript - use FetchWindowScript and not Fetch for first request
 * @param sbVersionOverride - Override SpeedBinb version detection
 */
export function PagesSinglePageAjax(useScript = false, sbVersionOverride: SpeedBinbVersion = undefined) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAjax.call(this, chapter, useScript, sbVersionOverride);
            }
        };
    };
}

async function getPageLinks_v016452(scraper: MangaScraper, configuration: Configurationv016452, params: Paramsv016452, chapter: Chapter): Promise<Page[]> {
    configuration.ctbl = _pt(params.cid, params.sharingKey, configuration.ctbl as string);
    configuration.ptbl = _pt(params.cid, params.sharingKey, configuration.ptbl as string);
    try {
        configuration.ServerType = parseInt(configuration.ServerType as string);
    } catch (error) {
        //
    }
    if (configuration.ServerType === 0) {//CMOA
        const uri = getSanitizedURL(configuration.ContentsServer, 'sbcGetCntnt.php');
        uri.searchParams.set('cid', params.cid);
        uri.searchParams.set('p', configuration.p);
        uri.searchParams.set('q', '1');
        uri.searchParams.set('vm', String(configuration.ViewMode));
        uri.searchParams.set('dmytime', configuration.ContentDate);
        uri.searchParams.set('u0', params.u0);
        uri.searchParams.set('u1', params.u1);
        return await fetchSBC(scraper, uri, configuration, chapter);
    }
    return Promise.reject(new Error('Content server type not supported!'));
}

async function getPageLinks_v016201(scraper: MangaScraper, configuration: Configurationv016452, sharingKey: string, u: string, chapter: Chapter): Promise<Page[]> {
    const cid = configuration.ContentID;
    configuration.ctbl = _pt(cid, sharingKey, configuration.ctbl as string);
    configuration.ptbl = _pt(cid, sharingKey, configuration.ptbl as string);
    try {
        configuration.ServerType = parseInt(configuration.ServerType as string);
    } catch (error) {
        //
    }

    if (configuration.ServerType === 2) {
        const uri = getSanitizedURL(configuration.ContentsServer, 'content');
        uri.searchParams.set('dmytime', configuration.ContentDate);
        uri.searchParams.set('u1', u);
        const data: SBCDATA = await FetchJSON(new Request(uri));
        const dom = new DOMParser().parseFromString(data.ttx, 'text/html');
        const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
            const src = img.getAttribute('src');
            uri.hash = window.btoa(JSON.stringify(lt_001(src, configuration.ctbl as string[], configuration.ptbl as string[])));
            return new Page(scraper, chapter, new URL(uri.href.replace('/content', '/img/' + src)));
        });
        return pageLinks;
    }
    return Promise.reject(new Error('Content server type not supported!'));
}

async function getPageLinks_v016130(scraper: MangaScraper, configuration: Configurationv016452, sharingKey: string, chapter: Chapter): Promise<Page[]> {
    const cid = configuration.ContentID;
    configuration.ctbl = _pt(cid, sharingKey, configuration.ctbl as string);
    configuration.ptbl = _pt(cid, sharingKey, configuration.ptbl as string);
    try {
        configuration.ServerType = parseInt(configuration.ServerType as string);
    } catch (error) {
        //
    }

    switch (configuration.ServerType as number) {
        case 0: { //Booklive
            const uri = getSanitizedURL(configuration.ContentsServer, 'sbcGetCntnt.php');
            uri.searchParams.set('cid', configuration.ContentID);
            uri.searchParams.set('dmytime', configuration.ContentDate);
            uri.searchParams.set('p', configuration.p);
            uri.searchParams.set('vm', String(configuration.ViewMode));
            return await fetchSBC(scraper, uri, configuration, chapter);
        }
        case 1: {//Futabanet, Getsuaku, BookHodai
            const uri = getSanitizedURL(configuration.ContentsServer, 'content.js');
            if (configuration.ContentDate) uri.searchParams.set('dmytime', configuration.ContentDate);
            const response = await Fetch(new Request(uri));
            const data = await response.text();
            const jsonObj: SBCDATA = JSON.parse(data.slice(16, -1));
            const dom = new DOMParser().parseFromString(jsonObj.ttx, 'text/html');
            const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
                let src = img.getAttribute('src');
                uri.hash = window.btoa(JSON.stringify(lt_001(src, configuration.ctbl as string[], configuration.ptbl as string[])));
                if (!src.startsWith('/')) src = '/' + src;
                return new Page(scraper, chapter, new URL(uri.href.replace('/content.js', src + '/M_H.jpg')));
            });
            return pageLinks;
        }
        case 2: {//MangaPlanet, MangaPlaza
            const uri = getSanitizedURL(configuration.ContentsServer, 'content');
            uri.searchParams.set('dmytime', configuration.ContentDate);
            const data = await FetchJSON<SBCDATA>(new Request(uri, { headers: { Referer: scraper.URI.href } }));
            const dom = new DOMParser().parseFromString(data.ttx, 'text/html');
            const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
                const src = img.getAttribute('src');
                uri.hash = window.btoa(JSON.stringify(lt_001(src, configuration.ctbl as string[], configuration.ptbl as string[])));
                return new Page(scraper, chapter, new URL(uri.href.replace('/content', '/img/' + src)));
            });
            return pageLinks;
        }
    }
    return Promise.reject(new Error('Content server type not supported!'));
}

async function fetchSBC(scraper: MangaScraper, uri: URL, configuration: Configurationv016452, chapter: Chapter) {
    const data = await FetchJSON<SBCDATA>(new Request(uri));
    const dom = new DOMParser().parseFromString(data.ttx, 'text/html');
    const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
        const src = img.getAttribute('src');
        uri.searchParams.set('src', src);
        uri.hash = window.btoa(JSON.stringify(lt_001(src, configuration.ctbl as string[], configuration.ptbl as string[])));
        return new Page(scraper, chapter, new URL(uri.href.replace('/sbcGetCntnt.php', '/sbcGetImg.php')));
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
        case page.Link.href.endsWith('ptimg.json'):
            return await descramble_v016061(this, page, priority, signal, detectMimeType);
        case page.Link.href.includes('sbcGetImg'):
        case page.Link.href.includes('M_L.jpg'):
        case page.Link.href.includes('M_H.jpg'):
        case page.Link.href.includes('/img/'):
            return await descramble_v016130(this, page, priority, signal, detectMimeType);
    }
    throw new Error('Unsupported version of SpeedBinb reader!');
}

async function descramble_v016061(scraper: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    const data = await FetchJSON<JSONImageDatav016061>(new Request(page.Link));
    const fakepage = new Page(scraper, page.Parent as Chapter, new URL(data.resources.i.src, page.Link.href));
    const imagedata: Blob = await Common.FetchImageAjax.call(scraper, fakepage, priority, signal, detectMimeType);

    return DeScramble(imagedata, async (image, ctx) => {
        const view = data.views[0];

        for (const part of view.coords) {
            const num = part.split(/[:,+>]/);
            const sourceX = parseInt(num[1]);
            const sourceY = parseInt(num[2]);
            const targetX = parseInt(num[5]);
            const targetY = parseInt(num[6]);
            const partWidth = parseInt(num[3]);
            const partHeight = parseInt(num[4]);
            ctx.drawImage(image, sourceX, sourceY, partWidth, partHeight, targetX, targetY, partWidth, partHeight);
        }
    });
}

async function descramble_v016130(scraper: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType: boolean): Promise<Blob> {
    const imagedata: Blob = await Common.FetchImageAjax.call(scraper, page, priority, signal, detectMimeType);
    const descrambleKeyPair: DescrambleKP = JSON.parse(window.atob(page.Link.hash.slice(1)));

    return DeScramble(imagedata, async (image, ctx) => {
        const view = getImageDescrambleCoords(descrambleKeyPair.s, descrambleKeyPair.u, image.width, image.height);
        for (const part of view.transfers[0].coords) {
            ctx.drawImage(image, part.xsrc, part.ysrc, part.width, part.height, part.xdest, part.ydest, part.width, part.height);
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
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}

function _tt(t: string): string {
    const n = Date.now().toString(16).padStart(16, 'x'); // w.getRandomString(16)
    const i = Array(Math.ceil(16 / t.length) + 1).join(t);
    const r = i.substring(0, 16);
    const e = i.substring(i.length - 16);
    /*
    const r = i.substr(0, 16);
    const e = i.substr(-16, 16);
    */
    let s = 0;
    let u = 0;
    let h = 0;
    return n.split("").map(function (t, i) {
        return s ^= n.charCodeAt(i),
        u ^= r.charCodeAt(i),
        h ^= e.charCodeAt(i),
        t + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[s + u + h & 63];
    }).join("");
}

function _pt(t: string, i: string, n: string): string[] {
    const r = t + ':' + i;
    let e = 0;

    for (let s = 0; s < r.length; s++) {
        e += r.charCodeAt(s) << s % 16;
    }

    0 == (e &= 2147483647) && (e = 305419896);

    let u = '';
    let h = e;

    for (let s = 0; s < n.length; s++) {
        h = h >>> 1 ^ 1210056708 & -(1 & h);
        const o = (n.charCodeAt(s) - 32 + h) % 94 + 32;
        u += String.fromCharCode(o);
    }
    try {
        return JSON.parse(u);
    } catch (t) {
        return null;
    }
}

/**
 * Determine which descramble key pair from ctbl / ptbl shall be used
 * depending on the given image name  'pages/cu77gvXE.jpg'
 */
function lt_001(t: string, ctbl: string[], ptbl: string[]): DescrambleKP {
    const i = [0, 0];
    const n = t.lastIndexOf("/") + 1;
    const r = t.length - n;
    if (t) {
        for (let e = 0; e < r; e++)
            i[e % 2] += t.charCodeAt(e + n);
        i[0] %= 8,
        i[1] %= 8;
    }
    return { s: ptbl[i[0]], u: ctbl[i[1]] };
}

/**
 * Copied from official SpeedBinb library
 * t  imagecontext containing src property ('pages/cu77gvXE.jpg')
 * s, u descramble key pair, used to determine descrambler object
 * i  width of descrambled image
 * n height of descrambled image
 */
function getImageDescrambleCoords(/*t*/s: string, u: string, i: number, n: number): PageViewv016130 {
    const r = _lt_002(s, u); // var r = this.lt(t.src);
    if (!r || !r.vt())
        return null;
    const e = r.dt({
        width: i,
        height: n
    });
    return {
        width: e.width,
        height: e.height,
        transfers: [{
            index: 0,
            coords: r.gt({
                width: i,
                height: n
            })
        }]
    };
}

/**
 * Get a descrambler based on the descramble key pair from ctbl / ptbl
 */
function _lt_002(s: string, u: string) {
    return "=" === u.charAt(0) && "=" === s.charAt(0) ? new _speedbinb_f(u, s) : u.match(/^[0-9]/) && s.match(/^[0-9]/) ? new _speedbinb_a(u, s) : "" === u && "" === s ? new _speedbinb_h : null;
}

/**
 * Copied from official SpeedBinb library
 * define prototype for f
 */
const _speedbinb_f = function () {
    function s(t: string, i: string) {
        this.Mt = null;
        const n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/),
            r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);

        if (null !== n && null !== r && n[1] === r[1] && n[2] === r[2] && n[4] === r[4] && "+" === n[3] && "-" === r[3] && (this.C = parseInt(n[1], 10),
        this.I = parseInt(n[2], 10),
        this.jt = parseInt(n[4], 10),
        !(8 < this.C || 8 < this.I || 64 < this.C * this.I))) {
            const e = this.C + this.I + this.C * this.I;
            if (n[5].length === e && r[5].length === e) {
                const s = this.yt(n[5]),
                    u = this.yt(r[5]);
                this.xt = s.n,
                this.Et = s.t,
                this.It = u.n,
                this.St = u.t,
                this.Mt = [];
                for (let h = 0; h < this.C * this.I; h++)
                    this.Mt.push(s.p[u.p[h]]);
            }
        }
    }
    return s.prototype.vt = function (): boolean {
        return null !== this.Mt;
    }
    ,
    s.prototype.bt = function (t: Dimensions): boolean {
        const i = 2 * this.C * this.jt,
            n = 2 * this.I * this.jt;
        return t.width >= 64 + i && t.height >= 64 + n && t.width * t.height >= (320 + i) * (320 + n);
    }
    ,
    s.prototype.dt = function (t: Dimensions): Dimensions {
        return this.bt(t) ? {
            width: t.width - 2 * this.C * this.jt,
            height: t.height - 2 * this.I * this.jt
        } : t;
    }
    ,
    s.prototype.gt = function (t: Dimensions): DrawImageCoords[] {
        if (!this.vt())
            return null;
        if (!this.bt(t))
            return [{
                xsrc: 0,
                ysrc: 0,
                width: t.width,
                height: t.height,
                xdest: 0,
                ydest: 0
            }];

        const h: DrawImageCoords[] = [];
        const i = t.width - 2 * this.C * this.jt,
            n = t.height - 2 * this.I * this.jt,
            r = Math.floor((i + this.C - 1) / this.C),
            e = i - (this.C - 1) * r,
            s = Math.floor((n + this.I - 1) / this.I),
            u = n - (this.I - 1) * s;

        for (let o = 0; o < this.C * this.I; ++o) {
            const a = o % this.C,
                f = Math.floor(o / this.C),
                c = this.jt + a * (r + 2 * this.jt) + (this.It[f] < a ? e - r : 0),
                l = this.jt + f * (s + 2 * this.jt) + (this.St[a] < f ? u - s : 0),
                v = this.Mt[o] % this.C,
                d = Math.floor(this.Mt[o] / this.C),
                g = v * r + (this.xt[d] < v ? e - r : 0),
                p = d * s + (this.Et[v] < d ? u - s : 0),
                b = this.It[f] === a ? e : r,
                m = this.St[a] === f ? u : s;
            0 < i && 0 < n && h.push({
                xsrc: c,
                ysrc: l,
                width: b,
                height: m,
                xdest: g,
                ydest: p
            });
        }
        return h;
    }
    ,
    s.prototype.yt = function (t: string) {
        let i;
        const n = [], r = [], e = [];
        for (i = 0; i < this.C; i++)
            n.push(s.Tt[t.charCodeAt(i)]);
        for (i = 0; i < this.I; i++)
            r.push(s.Tt[t.charCodeAt(this.C + i)]);
        for (i = 0; i < this.C * this.I; i++)
            e.push(s.Tt[t.charCodeAt(this.C + this.I + i)]);
        return {
            t: n,
            n: r,
            p: e
        };
    }
    ,
    s.Tt = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
    s;
}();

/**
 * Copied from official SpeedBinb library
 * define prototype for a
 */
const _speedbinb_a = function () {
    function t(t: string, i: string) {
        this.mt = null,
        this.wt = null;
        const n = this.yt(t);
        const r = this.yt(i);
        n && r && n.ndx === r.ndx && n.ndy === r.ndy && (this.mt = n,
        this.wt = r);
    }
    return t.prototype.vt = function (): boolean {
        return null !== this.mt && null !== this.wt;
    }
    ,
    t.prototype.bt = function (t: Dimensions): boolean {
        return 64 <= t.width && 64 <= t.height && 102400 <= t.width * t.height;
    }
    ,
    t.prototype.dt = function (t: Dimensions): Dimensions {
        return t;
    }
    ,
    t.prototype.gt = function (t: Dimensions): DrawImageCoords[] {
        if (!this.vt())
            return null;
        const i = [];
        const n = t.width - t.width % 8,
            r = Math.floor((n - 1) / 7) - Math.floor((n - 1) / 7) % 8,
            e = n - 7 * r,
            s = t.height - t.height % 8,
            u = Math.floor((s - 1) / 7) - Math.floor((s - 1) / 7) % 8,
            h = s - 7 * u,
            o = this.mt.piece.length;
        if (!this.bt(t))
            return [{
                xsrc: 0,
                ysrc: 0,
                width: t.width,
                height: t.height,
                xdest: 0,
                ydest: 0
            }];
        for (let a = 0; a < o; a++) {
            const f = this.mt.piece[a],
                c = this.wt.piece[a];
            i.push({
                xsrc: Math.floor(f.x / 2) * r + f.x % 2 * e,
                ysrc: Math.floor(f.y / 2) * u + f.y % 2 * h,
                width: Math.floor(f.w / 2) * r + f.w % 2 * e,
                height: Math.floor(f.h / 2) * u + f.h % 2 * h,
                xdest: Math.floor(c.x / 2) * r + c.x % 2 * e,
                ydest: Math.floor(c.y / 2) * u + c.y % 2 * h
            });
        }
        const l = r * (this.mt.ndx - 1) + e,
            v = u * (this.mt.ndy - 1) + h;
        return l < t.width && i.push({
            xsrc: l,
            ysrc: 0,
            width: t.width - l,
            height: v,
            xdest: l,
            ydest: 0
        }),
        v < t.height && i.push({
            xsrc: 0,
            ysrc: v,
            width: t.width,
            height: t.height - v,
            xdest: 0,
            ydest: v
        }),
        i;
    }
    ,
    t.prototype.yt = function (t: string) {
        if (!t)
            return null;
        const i = t.split("-");
        if (3 != i.length)
            return null;
        const n = parseInt(i[0], 10),
            r = parseInt(i[1], 10),
            e = i[2];
        if (e.length != n * r * 2)
            return null;
        const v = [];
        const a = (n - 1) * (r - 1) - 1;
        const f = a + (n - 1);
        const c = f + (r - 1);
        const l = c + 1;

        for (let s, u, h, o, d = 0; d < n * r; d++)
            s = this.Ot(e.charAt(2 * d)),
            u = this.Ot(e.charAt(2 * d + 1)),
            d <= a ? o = h = 2 : d <= f ? (h = 2, o = 1) : d <= c ? (h = 1, o = 2) : d <= l && (o = h = 1),
            v.push({
                x: s,
                y: u,
                w: h,
                h: o
            });
        return {
            ndx: n,
            ndy: r,
            piece: v
        };
    }
    ,
    t.prototype.Ot = function (t: string) {
        let i = 0;
        let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(t);
        return n < 0 ? n = "abcdefghijklmnopqrstuvwxyz".indexOf(t) : i = 1,
        i + 2 * n;
    }
    ,
    t;
}();

/**
 * Copied from official SpeedBinb library
 * define prototype for h
 */
const _speedbinb_h = function () {
    function t() { }
    return t.prototype.vt = function (): boolean {
        return !0;
    }
    ,
    t.prototype.bt = function (): boolean {
        return !1;
    }
    ,
    t.prototype.dt = function (t: Dimensions): Dimensions {
        return t;
    }
    ,
    t.prototype.gt = function (t: Dimensions): DrawImageCoords[] {
        return [{
            xsrc: 0,
            ysrc: 0,
            width: t.width,
            height: t.height,
            xdest: 0,
            ydest: 0
        }];
    }
    ,
    t;
}();