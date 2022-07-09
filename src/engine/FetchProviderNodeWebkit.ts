import { GetLocale } from '../i18n/Localization';
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

function ModifyFetchHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
    // TODO: set cookies from chrome matching the details.url?
    //       const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));

    //const referers = details.requestHeaders?.filter(header => header.name.toLowerCase() === '');
    //if() {
    // window.location.hostname
    //}
    //headers.set('Referer', details.url);

    return {
        requestHeaders: [...RevealWebRequestHeaders(details.requestHeaders ?? [])]
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
    //       'requestHeaders' => allow change request headers?
    //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
    if(!chrome.webRequest.onBeforeSendHeaders.hasListener(ModifyFetchHeaders)) {
        chrome.webRequest.onBeforeSendHeaders.addListener(ModifyFetchHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
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
    const response = await Fetch(request);
    const content = await response.text();
    const mime = 'text/html'; // response.headers.get('content-type')
    return new DOMParser().parseFromString(content, mime);
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

async function FetchWindow(request: FetchRequest, timeout = 60_000): Promise<NWJS_Helpers.win> {

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

    const win = await new Promise<NWJS_Helpers.win>(resolve => nw.Window.open(request.url, options, win => resolve(win)));

    return new Promise((resolve, reject) => {

        const destroy = () => {
            win.close();
            reject(new Error(GetLocale().FetchProvider_FetchWindow_TimeoutError()));
        };

        let cancellation = setTimeout(destroy, timeout);

        async function load() {
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
        }

        // NOTE: Use policy to prevent any new popup windows
        win.on('new-win-policy', (_frame, _url, policy) => policy.ignore());
        win.on('document-start', (frame: Window) => PreventDialogs(win, frame));
        win.on('navigation', win.hide);
        win.on('loaded', load);
        // HACK: win.on('loaded', load) alone seems quite unreliable => enforce reload after event was attached ...
        win.reload();
    });
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
    const win = await FetchWindow(request, timeout);
    try {
        await Wait(delay);
        const result = win.eval(null, script) as unknown as T | Promise<T>;
        return await result;
    } catch(inner) {
        const outer = new EvalError('<script>', { cause: inner });
        console.error(inner, outer);
        throw outer;
    } finally {
        win.close();
    }
}