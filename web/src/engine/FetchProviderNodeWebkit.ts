import { EngineResourceKey as R } from '../i18n/ILocale';
import type { PreloadAction } from './FetchProvider';
import { FetchRedirection } from './AntiScrapingDetection';
import { CheckAntiScrapingDetection, PreventDialogs } from './AntiScrapingDetectionNodeWebkit';
import * as protobuf from 'protobufjs';
import { Exception, InternalError } from './Error';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host',
    'Sec-Fetch-Dest'
];

type GraphQLResult<T> = {
    errors: { message: string, code: number }[],
    data: T
};

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

export async function FetchGraphQL<TResult>(request: FetchRequest, operationName: string, query: string, variables: string): Promise<TResult> {

    const graphQLRequest = new FetchRequest(request.url, {
        body: JSON.stringify({ operationName, query, variables }),
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': '*/*' }
    });

    //copy custom headers from parent request
    for (const header of request.headers) {
        graphQLRequest.headers.set(header[0], header[1]);
    }

    const data = await FetchJSON<GraphQLResult<TResult>>(graphQLRequest);
    if (data.errors && data.errors.length > 0) {
        throw new Exception(R.FetchProvider_FetchGraphQL_AggregateError, data.errors.map(error => error.message).join('\n'));
    }
    if (!data.data) {
        throw new Exception(R.FetchProvider_FetchGraphQL_MissingDataError);
    }
    return data.data;
}

export async function FetchRegex(request: FetchRequest, regex: RegExp): Promise<string[]> {
    if (regex.flags.indexOf('g') == -1) {
        throw new InternalError(`The provided RegExp must contain the global 'g' modifier!`);
    }
    const response = await fetch(request);
    const data = await response.text();
    const result : string[] = [];
    let match = undefined;
    // eslint-disable-next-line no-cond-assign
    while (match = regex.exec(data)) {
        result.push(match[1]);
    }
    return result;
}

export async function FetchProto<TResult>(request: FetchRequest, prototypes: string, responsetype: string) : Promise<TResult>{
    const Root = protobuf.parse(prototypes, { keepCase: true }).root.lookupType(responsetype);
    const response = await fetch(request);
    const data = await response.arrayBuffer();
    const message = Root.decode(new Uint8Array(data));
    return Root.toObject(message) as TResult;
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

function IsVerboseMode() {
    return window.localStorage.getItem('hakuneko-fetchwindow-verbose') === 'true';
}

async function FetchWindow(request: FetchRequest, timeout: number, preload: PreloadAction = () => undefined): Promise<NWJS_Helpers.win> {

    const options: NWJS_Helpers.WindowOpenOption & { mixed_context: boolean } = {
        new_instance: false, // TODO: Would be safer when set to TRUE, but this would prevent sharing cookies ...
        mixed_context: false,
        show: IsVerboseMode(),
        position: 'center',
        width: 1280,
        height: 720,
        //inject_js_start: 'filename'
        //inject_js_end: 'filename'
    };

    return await new Promise<NWJS_Helpers.win>((resolve, reject) => nw.Window.open(request.url/*'data:text/plain,'*/, options, win => {

        const invocations: {
            name: string;
            info: string
        }[] = [];

        let cancellation = setTimeout(destroy, timeout);

        function destroy() {
            if(!invocations.some(invocation => invocation.name === 'DOMContentLoaded' || invocation.name === 'loaded')) {
                console.warn(`FetchWindow() timed out without <DOMContentLoaded> or <loaded> event being invoked!`, invocations);
            }
            if(IsVerboseMode()) {
                console.log('FetchWindow()::invocations', invocations);
            } else {
                win.close();
            }
            reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
        }

        let verify = async () => {
            try {
                verify = () => Promise.resolve();
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
                if(!IsVerboseMode()) {
                    win.close();
                }
                reject(error);
            } finally {
                if(IsVerboseMode()) {
                    console.log('FetchWindow()::invocations', invocations);
                }
            }
        };

        if(win?.window?.window) {
            invocations.push({ name: 'opened', info: win.window?.location?.href });
            preload(win.window.window, win.window.window);
            PreventDialogs(win, win.window.window);
        }

        win.on('document-start', (frame: typeof window) => {
            if(win.window === frame) {
                win.window.document.addEventListener('DOMContentLoaded', () => {
                    invocations.push({ name: 'DOMContentLoaded', info: win.window?.location?.href });
                    verify();
                });
            }
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

        win.on('loaded', () => {
            invocations.push({ name: 'loaded', info: win.window?.location?.href });
            verify();
        });

        // HACK: win.on('loaded', load) alone seems quite unreliable => enforce reload after event was attached ...
        //win.reload();
    }));
}

export async function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout = 60_000): Promise<T[]> {
    const win = await FetchWindow(request, timeout);
    try {
        await Wait(delay);
        const dom = win.window.document as Document;
        return [...dom.querySelectorAll(query)] as T[];
    } finally {
        if(!IsVerboseMode()) {
            win.close();
        }
    }
}

export async function FetchWindowScript<T>(request: FetchRequest, script: string, delay = 0, timeout = 60_000): Promise<T> {
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
            new Promise<T>((_, reject) => setTimeout(reject, timeout - elapsed, new Exception(R.FetchProvider_FetchWindow_TimeoutError)))
        ]);
    } finally {
        if(!IsVerboseMode()) {
            win.close();
        }
    }
}