import { Fetch, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import DeScramble from '../../transformers/ImageDescrambler';

type ViewerData = {
    viewerUrl: URL;
    SBHtmlElement: HTMLElement
}

type RequestData = {
    cid: string,
    sharingKey: string,
    dmytime,
    u0: string,
    u1: string,
    config: ContentConfiguration
}

type JSONPageData = {
    items: ContentConfiguration[]
}

type ContentConfiguration = {
    ContentID: string,
    ctbl: string | string[],
    ptbl: string | string[],
    ServerType: number | string
    ContentsServer: string,
    p: string,
    ViewMode: number,
    ContentDate: string
}

type JSONImageData = {
    resources: {
        i: {
            src: string
        }
    }
    views: {
        coords: string[],
        width: number,
        height: number
    }[]
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
    new Promise((resolve, reject) => {
        try {
            fetch('{URI}')
                .then(response => response.json())
                .then(json => resolve(json))
        } catch (error) {
            reject(error);
        }
    });
`;

export enum SpeedBindVersion { v016061, v016452, v016201, v016130 };

function getSanitizedURL(base: string, append: string): URL {
    const baseURI = new URL(append, base + '/');
    baseURI.pathname = baseURI.pathname.replaceAll(/\/\/+/g, '/');
    return baseURI;
}

/**
 *  Return real chapter url & SpeedBinb "pages" element from said page, so we can work
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 */
async function GetViewerData(this: MangaScraper, chapter: Chapter): Promise<ViewerData> {
    let viewerUrl = new URL(chapter.Identifier, this.URI);
    const request = new Request(viewerUrl, {
        headers: {
            Referer: this.URI.href
        }
    });

    const response = await Fetch(request);
    const dom = new DOMParser().parseFromString(await response.text(), 'text/html');
    const SBHtmlElement = dom.querySelector<HTMLElement>('div#content.pages');
    //handle redirection. Sometimes chapter is redirected
    if (response.redirected) {
        viewerUrl = new URL(response.url);
    }
    return { viewerUrl, SBHtmlElement };
}
/**
 * Create first SpeedBinb AJAX request to perform, using viewerUrl GET parameters, and endpoint from SpeedBinb HTML node
 * @param viewerUrl - Read Url of the SpeedBinb Viewer
 * @param sbHtmlElement - HTMLElement extracted from said page
 */
async function CreatePtBinbRequestData(viewerUrl: URL, sbHtmlElement: HTMLElement, needCookies: boolean = false): Promise<RequestData> {
    let cid = viewerUrl.searchParams.get('cid') ?? sbHtmlElement.dataset['ptbinbCid'];

    //in case cid is not in url and not in html, try to get it from page redirected by Javascript/ Meta element
    if (!cid) {
        cid = await FetchWindowScript<string>(new Request(viewerUrl), 'new URL(window.location).searchParams.get("cid");', 5000);
    }
    if (!cid) throw new Error('Unable to find CID (content ID) !');

    const sharingKey = _tt(cid);
    const uri = getSanitizedURL(viewerUrl.href, sbHtmlElement.dataset.ptbinb);
    const dmytime = Date.now().toString();
    uri.searchParams.set('cid', cid);
    uri.searchParams.set('dmytime', dmytime);
    uri.searchParams.set('k', sharingKey);

    const u0 = viewerUrl.searchParams.get('u0');
    const u1 = viewerUrl.searchParams.get('u1');
    if (u0) uri.searchParams.set('u0', u0);
    if (u1) uri.searchParams.set('u1', u1);

    const request = new Request(uri, {
        headers: {
            Referer: viewerUrl.href
        }
    });

    const { items } = !needCookies ? await FetchJSON<JSONPageData>(request) :
        await FetchWindowScript<JSONPageData>(new Request(viewerUrl), JsonFetchScript.replace('{URI}', uri.href), 2000);

    return { cid, sharingKey, dmytime, u0, u1, config: items.at(0) };
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
    const { viewerUrl, SBHtmlElement } = await GetViewerData.call(this, chapter);
    if (version == SpeedBindVersion.v016061) {
        //ComicBrise, ComicMeteor, ComicPorta, ComicValKyrie, MichiKusa, OneTwoThreeHon, TKSuperheroComics
        const [...imageConfigurations] = SBHtmlElement.querySelectorAll<HTMLDivElement>('div[data-ptimg$="ptimg.json"]');
        return imageConfigurations.map(element => new Page(this, chapter, getSanitizedURL(viewerUrl.href, element.dataset.ptimg)));
    }

    const params = await CreatePtBinbRequestData(viewerUrl, SBHtmlElement, needCookies);
    return getPagesLinks.call(this, params, chapter, version);
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter from a website using SpeedBinb Viewer.
 * @param version - SpeedBinb version used by the website
 * @param needCookies - Use browser window to perform first JSON request to get access cookies properly
 */

export function PagesSinglePageAjax(version: SpeedBindVersion, needCookies = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAjax.call(this, chapter, version, needCookies);
            }
        };
    };
}
async function getPagesLinks(this: MangaScraper, params: RequestData, chapter: Chapter, version: SpeedBindVersion): Promise<Page[]> {
    const configuration = params.config;
    const cid = version === SpeedBindVersion.v016452 ? params.cid : configuration.ContentID;
    configuration.ctbl = _pt(cid, params.sharingKey, configuration.ctbl as string);
    configuration.ptbl = _pt(cid, params.sharingKey, configuration.ptbl as string);
    try {
        configuration.ServerType = parseInt(configuration.ServerType as string);
    } catch { }

    switch (configuration.ServerType as number) {
        case 0: { //v016130 Booklive , v016452 CMOA
            const uri = getSanitizedURL(configuration.ContentsServer, 'sbcGetCntnt.php');
            uri.searchParams.set('cid', cid);
            uri.searchParams.set('dmytime', configuration.ContentDate);
            uri.searchParams.set('p', configuration.p);
            uri.searchParams.set('vm', configuration.ViewMode.toString());
            if (version === SpeedBindVersion.v016452) { //CMOA
                uri.searchParams.set('q', '1');
                uri.searchParams.set('u0', params.u0);
                uri.searchParams.set('u1', params.u1);
            }
            return await ExtractPages.call(this, uri, '/sbcGetCntnt.php', '/sbcGetImg.php', configuration, chapter, true);
        }

        case 1: {//v016130 Futabanet, BookHodai, Booklive, OhtaBooks, SManga
            const uri = getSanitizedURL(configuration.ContentsServer, 'content.js');
            if (configuration.ContentDate) uri.searchParams.set('dmytime', configuration.ContentDate);
            return await ExtractPages.call(this, uri, '/content.js', '{src}/M_H.jpg', configuration, chapter);
        }
        case 2: {//v016130 MangaPlanet, MangaPlaza, Yanmaga, Yomonga
            const uri = getSanitizedURL(configuration.ContentsServer, 'content');
            if (configuration.ContentDate) uri.searchParams.set('dmytime', configuration.ContentDate);
            if (version === SpeedBindVersion.v016201) uri.searchParams.set('u1', params.u1); //YOUNGJUMP
            return await ExtractPages.call(this, uri, '/content', '/img/{src}', configuration, chapter);
        }
    }
    return Promise.reject(new Error('Content server type not supported!'));
}

async function ExtractPages(uri: URL, replaceFrom : string, replaceto: string, configuration: ContentConfiguration, chapter: Chapter, setSrc = false): Promise<Page[]> {
    const response = await Fetch(new Request(uri, { headers: { Referer: this.URI.href } }));
    const data = await response.text();
    const { ttx }: SBCDATA = data.startsWith('DataGet_Content(') ? JSON.parse(data.slice(16, -1)) : JSON.parse(data);
    const dom = new DOMParser().parseFromString(ttx, 'text/html');
    const pageLinks = [...dom.querySelectorAll<HTMLImageElement>('t-case:first-of-type t-img')].map(img => {
        let src = img.getAttribute('src');

        const pageUri = new URL(uri);
        pageUri.hash = window.btoa(JSON.stringify(lt_001(src, configuration.ctbl as string[], configuration.ptbl as string[])));
        if (setSrc) pageUri.searchParams.set('src', src);

        if (!src.startsWith('/')) src = '/' + src;
        pageUri.href = pageUri.href.replace(replaceFrom, replaceto.replace('{src}', src));
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
    const data = await FetchJSON<JSONImageData>(new Request(page.Link));
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
    } catch {
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