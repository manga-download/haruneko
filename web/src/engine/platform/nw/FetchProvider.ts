import { Exception } from '../../Error';
import type { FeatureFlags } from '../../FeatureFlags';
import { EngineResourceKey as R } from '../../../i18n/ILocale';
import { FetchProvider, type ScriptInjection } from '../FetchProviderCommon';
import { FetchRedirection } from '../AntiScrapingDetection';
import { CheckAntiScrapingDetection } from './AntiScrapingDetection';

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

async function UpdateCookieHeader(url: string, headers: Headers) {
    const name = fetchApiSupportedPrefix + 'Cookie';
    const value = headers.get(name);
    const cookies = value ? value.split(';').map(cookie => cookie.trim()) : [];
    const browserCookies = await chrome.cookies.getAll({ url });
    for(const browserCookie of browserCookies) {
        if(cookies.none(cookie => cookie.startsWith(browserCookie.name + '='))) {
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

export default class extends FetchProvider {

    constructor(private readonly featureFlags: FeatureFlags) {
        super();
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
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }

    public async FetchWindow(request: Request, timeout: number, preload: ScriptInjection<void> = () => undefined): Promise<NWJS_Helpers.win> {

        // TODO: Handle abort signals
        //request.signal.addEventListener('abort', () => undefined);
        //if(request.signal.aborted) { /* */ }

        const options: NWJS_Helpers.WindowOpenOption & { mixed_context: boolean } = {
            new_instance: false, // TODO: Would be safer when set to TRUE, but this would prevent sharing cookies ...
            mixed_context: false,
            show: this.featureFlags.VerboseFetchWindow.Value,
            position: 'center',
            width: 1280,
            height: 720,
            //inject_js_start: 'filename'
            //inject_js_end: 'filename'
        };

        return await new Promise<NWJS_Helpers.win>((resolve, reject) => nw.Window.open(request.url, options, win => {

            const invocations: {
                name: string;
                info: string
            }[] = [];

            invocations.push({ name: 'nw.Window.open()', info: `Request URL: ${request.url}, Window URL: ${win?.window?.location.href}`});

            function destroy() {
                teardownOpenedWindow();
                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
            }

            let cancellation = setTimeout(destroy, timeout);
            let teardownOpenedWindow = () => {
                clearTimeout(cancellation);
                performRedirectionOrFinalize = () => Promise.resolve();
                // NOTE: removing listeners seems to have no effect, probably a bug in NW.js
                win.removeAllListeners('document-start');
                win.removeAllListeners('new-win-policy');
                win.removeAllListeners('navigation');
                win.removeAllListeners('loaded');
                win.removeAllListeners();
                if(invocations.none(invocation => invocation.name === 'DOMContentLoaded' || invocation.name === 'loaded')) {
                    console.warn('FetchWindow() was terminated without <DOMContentLoaded> or <loaded> event being invoked!', invocations);
                } else if(this.featureFlags.VerboseFetchWindow.Value) {
                    console.log('FetchWindow()::invocations', invocations);
                }
            };

            let performRedirectionOrFinalize = async () => {
                try {
                    const redirect = await CheckAntiScrapingDetection(win);
                    invocations.push({ name: 'performRedirectionOrFinalize()', info: `Mode: ${FetchRedirection[redirect]}`});
                    switch (redirect) {
                        case FetchRedirection.Interactive:
                            // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                            clearTimeout(cancellation);
                            cancellation = setTimeout(destroy, 150_000);
                            win.show();
                            win.requestAttention(3);
                            break;
                        case FetchRedirection.Automatic:
                            break;
                        default:
                            teardownOpenedWindow();
                            resolve(win);
                            break;
                    }
                } catch(error) {
                    teardownOpenedWindow();
                    reject(error);
                }
            };

            if(!win.window || nw.Window.get().window === win.window) {
                invocations.push({ name: 'win.window', info: `Invalid DOM Window: ${win.window}`});
                teardownOpenedWindow();
                return reject(new Error('Failed to open window (invalid content)!'));
            } else {
                win.eval(null, preload instanceof Function ? `(${preload})()` : preload);
                //preload(win.window.window, win.window.window);
                //PreventDialogs(win, win.window.window);
            }

            win.on('document-start', (frame: typeof window) => {
                invocations.push({ name: `win.on('document-start')`, info: `Window URL: '${win.window?.location?.href}' / Frame URL: '${frame?.location?.href}'` });
                if(win.window === frame) {
                    //preload(win.window.window, frame);
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
                //PreventDialogs(win, frame);
            });

            // NOTE: Use policy to prevent any new popup windows
            win.on('new-win-policy', (_frame, url, policy) => {
                invocations.push({ name: `win.on('new-win-policy')`, info: url });
                policy.ignore();
            });

            win.on('navigation', (_frame, url, _policy) => {
                invocations.push({ name: `win.on('navigation')`, info: url });
                //policy.ignore();
                win.hide();
            });

            win.on('loaded', () => {
                invocations.push({ name: `win.on('loaded')`, info: win.window?.location?.href });
                if(win.window && win.window !== nw.Window.get().window) {
                    performRedirectionOrFinalize();
                }
            });
        }));
    }

    public async FetchWindowScript<T extends void | JSONElement>(request: Request, script: ScriptInjection<T>, delay = 0, timeout = 60_000): Promise<T> {
        return this.FetchWindowPreloadScript(request, () => undefined, script, delay, timeout);
    }

    public async FetchWindowPreloadScript<T extends void | JSONElement>(request: Request, preload: ScriptInjection<void>, script: ScriptInjection<T>, delay = 0, timeout = 60_000): Promise<T> {
        const start = Date.now();
        const win = await this.FetchWindow(request, timeout, preload);
        const elapsed = Date.now() - start;
        try {
            await super.Wait(delay);
            let result: T | Promise<T>;
            try {
                result = win.eval(null, script instanceof Function ? `(${script})()` : script) as unknown as T | Promise<T>;
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
            if(!this.featureFlags.VerboseFetchWindow.Value) {
                win.close(true);
            }
        }
    }
}