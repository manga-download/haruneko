import { FetchProvider } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-'.toLowerCase();
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Cookie',
    'Referer',
    'Origin',
    'Host',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Dest',
    'Sec-Fetch-Site',
];

class FetchRequest extends Request {

    constructor (input: URL | RequestInfo, init?: RequestInit) {
        if (init?.headers) {
            init.headers = FetchRequest.ConcealHeaders(init.headers);
        }
        // NOTE: Since all website requests made from the app-domain are cross-origin, the `same-origin` default would strip the cookies and authorization header.
        //       => Always use `include` when no other credentials are provided to keep the cookies and authorization header for requests made from the app-domain.
        super(input, { credentials: 'include', ...init });
    }

    private static ConcealHeaders(init: HeadersInit): Headers {
        const headers = new Headers(init);
        for (const name of fetchApiForbiddenHeaders) {
            if (headers.has(name)) {
                headers.set(fetchApiSupportedPrefix + name, headers.get(name));
                headers.delete(name);
            }
        }
        return headers;
    }
}

export default class extends FetchProvider {

    /**
     * Configure various system globals to bypass FetchAPI limitations.
     * This method can only be run once for all instances.
     */
    public Initialize(featureFlags: FeatureFlags) {

        super.Initialize(featureFlags);

        // Abuse the global Request type to check if system is already initialized
        if (globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        // Forward compatibility for future chrome versions (MV3 - Manifest v3)
        /*
        const nativeChromeCookiesGetAll = chrome.cookies.getAll;
        chrome.cookies.getAll = function (details: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]> {
            return new Promise<chrome.cookies.Cookie[]>(resolve => nativeChromeCookiesGetAll(details, resolve));
        };
        */

        // NOTE: parameter extraInfoSpec:
        //       'blocking'       => sync request required for header modification
        //       'requestHeaders' => allow change request headers
        //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
        if (!chrome.webRequest.onBeforeSendHeaders.hasListener(this.ModifyRequestHeaders)) {
            chrome.webRequest.onBeforeSendHeaders.addListener(this.ModifyRequestHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
        }

        // NOTE: parameter extraInfoSpec:
        //       'blocking'        => sync request required for header modification
        //       'responseHeaders' => allow change response headers
        //       'extraHeaders'    => allow change 'referer', 'origin', 'cookie'
        if (!chrome.webRequest.onHeadersReceived.hasListener(this.ModifyResponseHeaders)) {
            chrome.webRequest.onHeadersReceived.addListener(this.ModifyResponseHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'responseHeaders', 'extraHeaders' ]);
        }

        // TODO: Swith to chrome.declarativeNetRequest
        //       => https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#evaluation
        //       chrome.declarativeWebRequest.onRequest.addRules(...);
        //       chrome.declarativeWebRequest.onRequest.addListener(...);
    }

    public async Fetch(request: Request): Promise<Response> {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }

    private MergeCookies(sessionCookies?: string, customCookies?: string): string {
        // TODO: Skip cookie assignment in browser window e.g., when `sec-fetch-dest: empty`?
        const cookies = new Map<string, string>();
        ((sessionCookies ?? '') + ';' + (customCookies ?? ''))
            .split(';')
            .map(cookie => cookie.split('='))
            .filter(cookie => cookie.length === 2)
            .forEach(([ name, value ]) => cookies.set(name.trim(), value.trim()));
        return cookies
            .entries()
            .reduce((accumulator: string[], [ name, value ]) => accumulator.concat(name + '=' + value), [])
            .join('; ');
    }

    private RevealHeaders(headers: chrome.webRequest.HttpHeader[]): Headers {
        const result = new Headers();
        const patternConcealedHeaderName = new RegExp('^' + fetchApiSupportedPrefix, 'i');
        const IsHeaderNameConcealed = (name: string) => patternConcealedHeaderName.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '');

        headers
            .filter(({ name, value }) => name && value && !IsHeaderNameConcealed(name))
            .forEach(({ name, value }) => result.append(name, value));

        headers
            .filter(({ name, value }) => name && value && IsHeaderNameConcealed(name))
            .forEach(({ name, value }) => {
                name = GetRevealedHeaderName(name);
                result.set(name, /^cookie$/.test(name) ? this.MergeCookies(result.get(name), value) : value);
            });

        return result;
    }

    private ModifyRequestHeaders(details: chrome.webRequest.OnBeforeSendHeadersDetails): chrome.webRequest.BlockingResponse {
        const uri = new URL(details.url);
        const headers = this.RevealHeaders(details.requestHeaders ?? []);

        // Prevent leaking HakuNeko's host in certain headers
        [ 'origin', 'referer' ].forEach(name => {
            if (headers.get(name)?.startsWith(window.location.origin)) {
                headers.set(name, uri.origin);
            }
        });

        return {
            cancel: false,
            requestHeaders: [ ...headers.entries().map(([ name, value ]) => ({ name, value })) ],
        };
    }

    private ModifyResponseHeaders(details: chrome.webRequest.OnHeadersReceivedDetails): chrome.webRequest.BlockingResponse {
        return {
            // remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
            // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
            responseHeaders: details.responseHeaders.filter(header => header.name.toLocaleLowerCase() !== 'link')
        };
    }
}