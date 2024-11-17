import { FetchProvider } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Dest',
];

async function UpdateCookieHeader(url: string, headers: Headers) {
    // TODO: Skip cookie assignment in browser window?
    const cookieHeaderName = fetchApiSupportedPrefix + 'Cookie';
    const headerCookies = headers.get(cookieHeaderName)?.split(';').filter(cookie => cookie.includes('=')).map(cookie => cookie.trim()) ?? [];
    const browserCookies = await chrome.cookies.getAll({ url, partitionKey: {} }); // Include empty partition filter since the chrome bug-fix does not work: https://issues.chromium.org/issues/323924496
    for(const browserCookie of browserCookies) {
        if(headerCookies.none(cookie => cookie.startsWith(browserCookie.name + '='))) {
            headerCookies.push(`${browserCookie.name}=${browserCookie.value}`);
        }
    }
    if(headerCookies.length > 0) {
        headers.set(cookieHeaderName, headerCookies.join('; '));
    }
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

    /**
     * Configure various system globals to bypass FetchAPI limitations.
     * This method can only be run once for all instances.
     */
    public Initialize(featureFlags: FeatureFlags) {

        super.Initialize(featureFlags);

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
}