import { FetchProvider, ParseCookiesFromHeader, MergeCookies } from '../FetchProviderCommon';
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
const concealedCookieHeaderName = fetchApiSupportedPrefix + 'Cookie';

class FetchRequest extends Request {

    readonly #referrer?: string;
    public override get referrer() { return this.#referrer; }

    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if (init?.headers) init.headers = FetchRequest.#ConcealHeaders(init.headers);
        super(input, init);
        this.#referrer = init?.referrer ?? undefined;
    }

    static #ConcealHeaders(init: HeadersInit): Headers {
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

export default class FetchProviderNW extends FetchProvider {

    #initialized = false;
    private readonly appHostname = window.location.hostname;

    /**
     * Configure various system globals to bypass FetchAPI limitations.
     * This method can only be run once for all instances.
     */
    public Initialize(featureFlags: FeatureFlags) {

        if (this.#initialized) {
            return;
        } else {
            this.#initialized = true;
        }

        super.Initialize(featureFlags);

        if (globalThis.Request !== FetchRequest) {
            // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
            globalThis.Request = FetchRequest;
        }

        // NOTE: parameter extraInfoSpec:
        //       'blocking'       => sync request required for header modification
        //       'requestHeaders' => allow change request headers
        //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
        if (!chrome.webRequest.onBeforeSendHeaders.hasListener(details => this.ModifyRequestHeaders(details.requestHeaders))) {
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
        if (request.credentials === 'omit') {
            request.headers.set(concealedCookieHeaderName, '');
            request.headers.delete('Authorization');
        } else {
            const cookie = MergeCookies(
                await chrome.cookies.getAll({ url: new URL(request.url).origin, partitionKey: {} }), // Include empty partition filter since the chrome bug-fix does not work: https://issues.chromium.org/issues/323924496
                ParseCookiesFromHeader(request.headers.get(concealedCookieHeaderName) ?? ''));
            request.headers.set(concealedCookieHeaderName, cookie);
            //console.log('Merged Session Cookies:', cookie);
        }
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
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

    private readonly ModifyRequestHeaders = function ModifyRequestHeaders(this: FetchProviderNW, originalHeaders: Record<string, string | string[]>): chrome.webRequest.BlockingResponse {

        const patternConcealedHeaderName = new RegExp('^' + fetchApiSupportedPrefix, 'i');
        const IsConcealed = (name: string) => patternConcealedHeaderName.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '').toLowerCase();

        const all: Array<[string, string | string[]]> = Object.entries(originalHeaders);
        const result = Object.fromEntries(all.filter(([name]) => !IsConcealed(name)).map(([name, value]) => [name.toLowerCase(), value]));
        const replacements = Object.fromEntries(all.filter(([name]) => IsConcealed(name)).map(([name, value]) => [GetRevealedHeaderName(name), value]));
        replacements['cookie'] = MergeCookies(
            //await chrome.cookies.getAll({ url: new URL(url).origin, partitionKey: {} }),
            ParseCookiesFromHeader(<string>result['cookie'] ?? ''),
            ParseCookiesFromHeader(<string>replacements['cookie'] ?? ''),
        );

        for (const name in replacements) {
            result[name] = replacements[name];
        }

        // Remove cookie header when empty
        if (!(<string>result['cookie'])?.trim()) delete result['cookie'];
        // Prevent leaking HakuNeko's host in certain headers
        if ((<string>result['origin'])?.includes(this.appHostname)) delete result['origin'];
        if ((<string>result['referer'])?.includes(this.appHostname)) delete result['referer'];

        return {
            cancel: false,
            requestHeaders: result,
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