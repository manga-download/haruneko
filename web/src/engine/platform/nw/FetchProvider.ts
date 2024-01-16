import { EngineResourceKey as R } from '../../../i18n/ILocale';
import type { IFetchProvider, PreloadAction } from '../FetchProvider';
import { FetchRedirection } from '../AntiScrapingDetection';
import { CheckAntiScrapingDetection } from './AntiScrapingDetection';
import * as protobuf from 'protobufjs';
import { Exception, InternalError } from '../../Error';
import type { JSONObject } from '../../../../../node_modules/websocket-rpc/dist/types';

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
    errors: {
        code: number;
        message: string;
    }[];
    data: T;
};

async function UpdateCookieHeader(url: string, headers: Headers) {
    const name = fetchApiSupportedPrefix + 'Cookie';
    const value = headers.get(name);
    const cookies = value ? value.split(';').map(cookie => cookie.trim()) : [];
    const browserCookies = await chrome.cookies.getAll({ url });
    for(const browserCookie of browserCookies) {
        if(!cookies.some(cookie => cookie.startsWith(browserCookie.name + '='))) {
            cookies.push(`${browserCookie.name}=${browserCookie.value}`);
        }
    }
    headers.set(name, cookies.join('; '));
}

function ConcealHeaders(init: HeadersInit): Headers {
    const headers = new Headers(init);
    for(const name of fetchApiForbiddenHeaders) {
        if(headers.has(name)) {
            headers.set(fetchApiSupportedPrefix + name, headers.get(name));
            headers.delete(name);
        }
    }
    return headers;
}

function RevealHeaders(headers: chrome.webRequest.HttpHeader[]): chrome.webRequest.HttpHeader[] {
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

    let headers = RevealHeaders(details.requestHeaders ?? []);

    // TODO: set cookies from chrome matching the details.url?
    //       const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));

    headers = headers.filter(header => {
        return header.name.toLowerCase() !== 'referer' || !header.value?.startsWith(window.location.origin);
    });

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

class FetchRequest extends Request {
    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if(init?.headers) {
            init.headers = ConcealHeaders(init.headers);
        }
        super(input, init);
    }
}

export default class implements IFetchProvider {

    public get IsVerboseModeEnabled() {
        return window.localStorage.getItem('hakuneko-fetchwindow-verbose') === 'true';
    }

    public set IsVerboseModeEnabled(value: boolean) {
        window.localStorage.setItem('hakuneko-fetchwindow-verbose', value.toString());
    }

    private async Wait(delay: number) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Configure various system globals to bypass FetchAPI limitations.
     * This method can only be run once for all instances.
     */
    public Initialize() {

        // Abuse the global Request type to check if system is already initialized
        if(globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

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

    public async Fetch(request: Request): Promise<Response> {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        await UpdateCookieHeader(request.url, request.headers);
        return fetch(request);
    }

    public async FetchHTML(request: Request): Promise<Document> {
        const mime = 'text/html';
        const charsetPattern = /charset=([\w-]+)/;

        const response = await this.Fetch(request);
        const data = await response.arrayBuffer();
        const dom = new DOMParser().parseFromString(new TextDecoder().decode(data), mime);

        const charset = dom.head?.querySelector<HTMLMetaElement>('meta[charset]')?.getAttribute('charset')
            ?? dom.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
            ?? response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
            ?? 'UTF-8';

        return /UTF-?8/i.test(charset) ? dom : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);
    }

    public async FetchJSON<TResult>(request: Request): Promise<TResult> {
        const response = await this.Fetch(request);
        return response.json();
    }

    public async FetchCSS<T extends HTMLElement>(request: Request, query: string): Promise<T[]> {
        const dom = await this.FetchHTML(request);
        return [...dom.querySelectorAll(query)] as T[];
    }

    public async FetchGraphQL<TResult>(request: Request, operationName: string, query: string, variables: JSONObject): Promise<TResult> {

        const graphQLRequest = new Request(request.url, {
            body: JSON.stringify({ operationName: operationName, query: query, variables: variables }),
            method: 'POST',
            headers: { 'content-type': 'application/json', 'accept': '*/*' }
        });

        //copy custom headers from parent request
        for (const header of request.headers) {
            graphQLRequest.headers.set(header[0], header[1]);
        }

        const data = await this.FetchJSON<GraphQLResult<TResult>>(graphQLRequest);
        if (data.errors && data.errors.length > 0) {
            throw new Exception(R.FetchProvider_FetchGraphQL_AggregateError, data.errors.map(error => error.message).join('\n'));
        }
        if (!data.data) {
            throw new Exception(R.FetchProvider_FetchGraphQL_MissingDataError);
        }
        return data.data;
    }

    public async FetchRegex(request: Request, regex: RegExp): Promise<string[]> {
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

    public async FetchProto<TResult>(request: Request, schema: string, messageTypePath: string) : Promise<TResult> {
        const response = await fetch(request);
        const serialized = new Uint8Array(await response.arrayBuffer());
        const prototype = protobuf.parse(schema, { keepCase: true }).root.lookupType(messageTypePath);
        return prototype.decode(serialized).toJSON() as TResult;
    }

    /*
    public async FetchXPATH(request: Request, xpath: string): Promise<Node[]> {
        const dom = await this.FetchHTML(request);
        const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
    }
    */

    public async FetchWindow(request: Request, timeout: number, preload: PreloadAction = () => undefined): Promise<NWJS_Helpers.win> {

        const options: NWJS_Helpers.WindowOpenOption & { mixed_context: boolean } = {
            new_instance: false, // TODO: Would be safer when set to TRUE, but this would prevent sharing cookies ...
            mixed_context: false,
            show: this.IsVerboseModeEnabled,
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

            function destroy() {
                if(!invocations.some(invocation => invocation.name === 'DOMContentLoaded' || invocation.name === 'loaded')) {
                    console.warn(`FetchWindow() timed out without <DOMContentLoaded> or <loaded> event being invoked!`, invocations);
                }
                if(this.IsVerboseModeEnabled) {
                    console.log('FetchWindow()::invocations', invocations);
                } else {
                    win.close(true);
                }
                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
            }

            let cancellation = setTimeout(destroy, timeout);

            let performRedirectionOrFinalize = async () => {
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
                            performRedirectionOrFinalize = () => Promise.resolve();
                            clearTimeout(cancellation);
                            resolve(win);
                            break;
                    }
                } catch(error) {
                    clearTimeout(cancellation);
                    if(this.IsVerboseModeEnabled) {
                        win.close(true);
                    }
                    reject(error);
                } finally {
                    if(this.IsVerboseModeEnabled) {
                        console.log('FetchWindow()::invocations', invocations);
                    }
                }
            };

            if(win?.window?.window) {
                invocations.push({ name: 'opened', info: win.window?.location?.href });
                preload(win.window.window, win.window.window);
                //PreventDialogs(win, win.window.window);
            }

            win.on('document-start', (frame: typeof window) => {
                if(win.window === frame) {
                    if (win.window.document.readyState === 'loading') {
                        win.window.document.addEventListener('DOMContentLoaded', () => {
                            invocations.push({ name: 'DOMContentLoaded', info: win.window?.location?.href });
                            performRedirectionOrFinalize();
                        });
                    } else {
                        invocations.push({ name: 'DOMReady', info: win.window?.location?.href });
                        performRedirectionOrFinalize();
                    }
                }
                invocations.push({ name: 'document-start', info: `Window URL: '${win.window?.location?.href}' / Frame URL: '${frame?.location?.href}'` });
                preload(win.window.window, frame);
                //PreventDialogs(win, frame);
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
                // NOTE: The getter `win.window` throws an exception => disable access for now
                invocations.push({ name: 'loaded', info: '' /* win.window?.location?.href */ });
                performRedirectionOrFinalize();
            });

            // HACK: win.on('loaded', load) alone seems quite unreliable => enforce reload after event was attached ...
            //win.reload();
        }));
    }

    public async FetchWindowCSS<T extends HTMLElement>(request: Request, query: string, delay = 0, timeout = 60_000): Promise<T[]> {
        const win = await this.FetchWindow(request, timeout);
        try {
            await this.Wait(delay);
            const dom = win.window.document as Document;
            return [...dom.querySelectorAll(query)] as T[];
        } finally {
            if(!this.IsVerboseModeEnabled) {
                win.close(true);
            }
        }
    }

    public async FetchWindowScript<T>(request: Request, script: string, delay = 0, timeout = 60_000): Promise<T> {
        return this.FetchWindowPreloadScript(request, () => undefined, script, delay, timeout);
    }

    public async FetchWindowPreloadScript<T>(request: Request, preload: PreloadAction, script: string, delay = 0, timeout = 60_000): Promise<T> {
        const start = Date.now();
        const win = await this.FetchWindow(request, timeout, preload);
        const elapsed = Date.now() - start;
        try {
            await this.Wait(delay);
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
            if(!this.IsVerboseModeEnabled) {
                win.close(true);
            }
        }
    }
}