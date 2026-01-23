import { FetchProvider } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
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
    readonly #referrer: string = undefined;
    public override get referrer() { return this.#referrer; }
    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if(init?.headers) init.headers = FetchRequest.#ConcealHeaders(init.headers, init.credentials);
        super(input, init);
        if(init?.referrer) this.#referrer = init.referrer;
    }

    static #ConcealHeaders(init: HeadersInit, credentials?: RequestCredentials): Headers {
        const headers = new Headers(init);

        if (credentials?.toLowerCase() === 'omit') {
            headers.delete('Authorization');
            headers.delete('Cookie');
        }

        for (const name of fetchApiForbiddenHeaders) {
            if (headers.has(name)) {
                headers.set(fetchApiSupportedPrefix + name, headers.get(name));
                headers.delete(name);
            }
        }

        return headers;
    }
}

export default class FetchProviderNW extends FetchProvider {

    private readonly appHostname = window.location.hostname;

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

    // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    public async Fetch(request: Request): Promise<Response> {
        const concealedCookieHeaderName = fetchApiSupportedPrefix + 'Cookie';
        if (request.credentials !== 'omit' && !request.headers.has(concealedCookieHeaderName)) {
            request.headers.set(concealedCookieHeaderName, await this.GetSessionCookies(request.url));
        }
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }

    private async GetSessionCookies(url: string): Promise<string> {
        const sessionCookies = await chrome.cookies.getAll({ url, partitionKey: {} }); // Include empty partition filter since the chrome bug-fix does not work: https://issues.chromium.org/issues/323924496
        return sessionCookies.map(({ name, value }) => `${name}=${value}`).join(';'); // TODO: Maybe use `encodeURIComponent(cookie.value)`
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
            .forEach(({ name, value }) => result.set(GetRevealedHeaderName(name), value));

        return result;
    }

    private readonly ModifyRequestHeaders = function ModifyRequestHeaders(this: FetchProviderNW, details: chrome.webRequest.OnBeforeSendHeadersDetails): chrome.webRequest.BlockingResponse {
        const requestHeaders = new Headers(details.requestHeaders?.map(h => [ h.name, h.value ]) ?? []);
        requestHeaders.set('cookie', await this.GetSessionCookies(details.url));
        // NOTE: Previously this was assigned directly to `X-FetchAPI-Cookie` in `Fetch` call
        const headers = this.RevealHeaders(details.requestHeaders);

        // Remove certain headers when empty
        [ 'cookie' ].forEach(name => headers.has(name) && !headers.get(name)?.trim() ? headers.delete(name) : null);

        // Prevent leaking HakuNeko's host in certain headers
        [ 'origin', 'referer' ].forEach(name => headers.get(name)?.includes(this.appHostname) ? headers.delete(name) : null);

        return {
            cancel: false,
            requestHeaders: [ ...headers.entries().map(([ name, value ]) => ({ name, value })) ],
        };
    }.bind(this);

    private readonly ModifyResponseHeaders = function ModifyResponseHeaders(this: FetchProviderNW, details: chrome.webRequest.OnHeadersReceivedDetails): chrome.webRequest.BlockingResponse {
        return {
            // remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
            // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
            responseHeaders: details.responseHeaders.filter(header => header.name.toLocaleLowerCase() !== 'link')
        };
    }.bind(this);
}