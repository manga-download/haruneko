import { GetLocale } from '../i18n/Localization';
import type { PreloadAction } from './FetchProvider';
import { FetchRedirection, CheckAntiScrapingDetection, PreventDialogs } from './AntiScrapingDetectionNodeWebkit';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host'
];

export function RevealWebRequestHeaders(headers: chrome.webRequest.HttpHeader[]): chrome.webRequest.HttpHeader[] {
    function ContainsPrefixed(headers: chrome.webRequest.HttpHeader[], header: chrome.webRequest.HttpHeader): boolean {
        const prefixed = (fetchApiSupportedPrefix + header.name).toLowerCase();
        return headers.some(header => header.name.toLowerCase() === prefixed);
    }
    headers = headers.filter(header => !ContainsPrefixed(headers, header));
    for(const header of headers) {
        header.name = header.name.replace(new RegExp('^' + fetchApiSupportedPrefix, 'i'), '');
    }
    return headers;
}

function ModifyRequestHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {

    let headers = details.requestHeaders ?? [];

    // TODO: set cookies from chrome matching the details.url?
    //       const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));

    headers = details.requestHeaders?.filter(header => {
        if(header.name.toLowerCase() === 'referer' && header.value?.startsWith(window.location.origin)) {
            return false;
        }
        return true;
    });

    headers = RevealWebRequestHeaders(headers);

    return {
        requestHeaders: headers
    };
}

function ModifyResponseHeaders(details: chrome.webRequest.WebResponseHeadersDetails): chrome.webRequest.BlockingResponse {

    //Handle Set-Cookie header according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    const cookiesHeaders = details.responseHeaders.filter(header => header.name.toLowerCase() == 'set-cookie');
    //Multiple Set-Cookie headers can be sent in the same response.

    const url = new URL(details.url).origin;
    cookiesHeaders?.forEach(async header => {
        const details: chrome.cookies.SetDetails = { url: url };
        const cookie = header.value.split(';'); //TOKEN=3514g53df41gdf5g46d65gf3;Path=/;Secure
        const nameValue = cookie.shift().split('='); //first element is name=value
        details.name = nameValue.shift();
        details.value = nameValue.shift();
        //then treat the others either as name=value , or name only (which means name = true);
        cookie.forEach(element => {
            const keyPair = element.split('=');
            const key = keyPair.shift().toLowerCase();
            const value = keyPair.length > 0 ? keyPair.shift() : true;
            details[key] = value;
        });
        chrome.cookies.set(details);
    });

    return {
        // remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
        // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
        responseHeaders: details.responseHeaders.filter(header => header.name.toLocaleLowerCase() !== 'link')
    };
}

export function Initialize(): void {

    // Forward compatibility for future chrome versions (MV3 - Manifest v3)
    const nativeChromeCookiesGetAll = chrome.cookies.getAll;
    chrome.cookies.getAll = function(details: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]> {
        return new Promise<chrome.cookies.Cookie[]>(resolve => nativeChromeCookiesGetAll(details, resolve));
    };

    // NOTE: parameter extraInfoSpec:
    //       'blocking'       => sync request required for header modification
    //       'requestHeaders' => allow change request headers
    //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
    if(!chrome.webRequest.onBeforeSendHeaders.hasListener(ModifyRequestHeaders)) {
        chrome.webRequest.onBeforeSendHeaders.addListener(ModifyRequestHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
    }

    // NOTE: parameter extraInfoSpec:
    //       'blocking'        => sync request required for header modification
    //       'responseHeaders' => allow change response headers
    //       'extraHeaders'    => allow change 'referer', 'origin', 'cookie'
    if(!chrome.webRequest.onHeadersReceived.hasListener(ModifyResponseHeaders)) {
        chrome.webRequest.onHeadersReceived.addListener(ModifyResponseHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'responseHeaders', 'extraHeaders' ]);
    }

    // TODO: Swith to chrome.declarativeNetRequest
    //       => https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#evaluation
    //       chrome.declarativeWebRequest.onRequest.addRules(...);
    //       chrome.declarativeWebRequest.onRequest.addListener(...);
}

export class FetchRequest extends Request {

    // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    public constructor(input: RequestInfo, init?: RequestInit) {
        super(input, init);
        this.ConcealFetchHeaders(init?.headers);
    }

    private ConcealFetchHeaders(init?: HeadersInit): void {
        if(init) {
            const headers = new Headers(init);
            for(const name of fetchApiForbiddenHeaders) {
                const value = headers.get(name);
                if(value) {
                    this.headers.set(fetchApiSupportedPrefix + name, value);
                    this.headers.delete(name);
                }
            }
        }
    }

    public async UpdateCookieHeader() {
        const name = fetchApiSupportedPrefix + 'Cookie';
        const value = this.headers.get(name);
        const cookies = value ? value.split(';').map(cookie => cookie.trim()) : [];
        const browserCookies = await chrome.cookies.getAll({ url: this.url });
        for(const browserCookie of browserCookies) {
            if(!cookies.some(cookie => cookie.startsWith(browserCookie.name + '='))) {
                cookies.push(`${browserCookie.name}=${browserCookie.value}`);
            }
        }
        this.headers.set(name, cookies.join('; '));
    }
}

export async function Fetch(request: FetchRequest): Promise<Response> {
    await request.UpdateCookieHeader();
    return fetch(request);
}

export async function FetchHTML(request: FetchRequest): Promise<Document> {
    const mime = 'text/html';
    const charsetPattern = /charset=([\w-]+)/;

    const response = await Fetch(request);
    const data = await response.arrayBuffer();
    const dom = new DOMParser().parseFromString(new TextDecoder().decode(data), mime);

    const charset = dom.head?.querySelector<HTMLMetaElement>('meta[charset]')?.getAttribute('charset')
        ?? dom.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
        ?? response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
        ?? 'UTF-8';

    return /UTF-?8/i.test(charset) ? dom : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);
}

export async function FetchJSON<TResult>(request: FetchRequest): Promise<TResult> {
    const response = await Fetch(request);
    return response.json();
}

export async function FetchCSS<T extends HTMLElement>(request: FetchRequest, query: string): Promise<T[]> {
    const dom = await FetchHTML(request);
    return [...dom.querySelectorAll(query)] as T[];
}

/*
public async FetchXPATH(request: FetchRequest, xpath: string): Promise<Node[]> {
    const dom = await this.FetchHTML(request);
    const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
}
*/

async function Wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function FetchWindow(request: FetchRequest, timeout: number, preload: PreloadAction = () => undefined): Promise<NWJS_Helpers.win> {

    const options: NWJS_Helpers.WindowOpenOption & { mixed_context: boolean } = {
        new_instance: false, // TODO: Would be safer when set to TRUE, but this would prevent sharing cookies ...
        mixed_context: false,
        show: false,
        position: 'center',
        width: 1280,
        height: 720,
        //inject_js_start: 'filename'
        //inject_js_end: 'filename'
    };

    return await new Promise<NWJS_Helpers.win>((resolve, reject) => nw.Window.open(request.url/*'data:text/plain,'*/, options, win => {

        const invocations: {
            name: 'opened' | 'document-start' | 'loaded' | 'new-win-policy' | 'navigation';
            info: string
        }[] = [];

        if(win?.window?.window) {
            invocations.push({ name: 'opened', info: win.window?.location?.href });
            preload(win.window.window, win.window.window);
            PreventDialogs(win, win.window.window);
        }

        win.on('document-start', (frame: typeof window) => {
            invocations.push({ name: 'document-start', info: `Window URL: '${win.window?.location?.href}' / Frame URL: '${frame?.location?.href}'` });
            preload(win.window.window, frame);
            PreventDialogs(win, frame);
        });

        // NOTE: Use policy to prevent any new popup windows
        win.on('new-win-policy', (_frame, url, policy) => {
            invocations.push({ name: 'new-win-policy', info: url });
            policy.ignore();
        });

        win.on('navigation', (_frame, url/*, policy*/) => {
            invocations.push({ name: 'navigation', info: url });
            //policy.ignore();
            win.hide();
        });

        const destroy = () => {
            win.close();
            if(!invocations.some(invocation => invocation.name === 'loaded')) {
                console.warn(`FetchWindow() timed out without <loaded> event being invoked!`);
            }
            console.log('FetchWindow()::invocations', invocations);
            reject(new Error(GetLocale().FetchProvider_FetchWindow_TimeoutError()));
        };

        let cancellation = setTimeout(destroy, timeout);

        win.on('loaded', async () => {
            invocations.push({ name: 'loaded', info: win.window?.location?.href });
            try {
                const redirect = await CheckAntiScrapingDetection(win);
                switch (redirect) {
                    case FetchRedirection.Interactive:
                        // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                        clearTimeout(cancellation);
                        cancellation = setTimeout(destroy, 150_000);
                        win.show();
                        break;
                    case FetchRedirection.Automatic:
                        break;
                    default:
                        clearTimeout(cancellation);
                        resolve(win);
                        break;
                }
            } catch(error) {
                clearTimeout(cancellation);
                win.close();
                reject(error);
            }
        });

        // HACK: win.on('loaded', load) alone seems quite unreliable => enforce reload after event was attached ...
        //win.reload();
    }));
}

export async function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout?: number): Promise<T[]> {
    const win = await FetchWindow(request, timeout);
    try {
        await Wait(delay);
        const dom = win.window.document as Document;
        return [...dom.querySelectorAll(query)] as T[];
    } finally {
        win.close();
    }
}

export async function FetchWindowScript<T>(request: FetchRequest, script: string, delay = 0, timeout?: number): Promise<T> {
    return FetchWindowPreloadScript(request, () => undefined, script, delay, timeout);
}

export async function FetchWindowPreloadScript<T>(request: FetchRequest, preload: PreloadAction, script: string, delay = 0, timeout = 60_000): Promise<T> {
    const start = Date.now();
    const win = await FetchWindow(request, timeout, preload);
    const elapsed = Date.now() - start;
    try {
        await Wait(delay);
        let result: T | Promise<T>;
        try {
            result = win.eval(null, script) as unknown as T | Promise<T>;
        } catch(inner) {
            const outer = new EvalError('<script>', { cause: inner });
            console.error(inner, outer);
            throw outer;
        }
        // wait for completion, otherwise finally block will be executed before the result is received
        return await Promise.race<T>([
            result,
            new Promise<T>((_, reject) => setTimeout(reject, timeout - elapsed, new Error(GetLocale().FetchProvider_FetchWindow_TimeoutError())))
        ]);
    } finally {
        win.close();
    }
}