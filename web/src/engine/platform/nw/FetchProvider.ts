import { FetchProvider } from '../FetchProviderCommon';
import { ParseCookiesFromHeader, MergeCookiesIntoHeader } from '../CookieHelper';
import { FetchConcealedRequest, FetchApiSupportedPrefix } from '../FetchConcealedRequest';
import type { FeatureFlags } from '../../FeatureFlags';

export default class FetchProviderNW extends FetchProvider {

    #initialized = false;
    private readonly appHostname = window.location.hostname;
    #patternFetchApiSupportedPrefix = new RegExp(`^${FetchApiSupportedPrefix}`, 'i');

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

        if (globalThis.Request !== FetchConcealedRequest) {
            // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
            globalThis.Request = FetchConcealedRequest;
        }

        // NOTE: parameter extraInfoSpec:
        //       'blocking'       => sync request required for header modification
        //       'requestHeaders' => allow change request headers
        //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
        if (!chrome.webRequest.onBeforeSendHeaders.hasListener(this.#ModifyRequestHeaders)) {
            chrome.webRequest.onBeforeSendHeaders.addListener(this.#ModifyRequestHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
        }

        // NOTE: parameter extraInfoSpec:
        //       'blocking'        => sync request required for header modification
        //       'responseHeaders' => allow change response headers
        //       'extraHeaders'    => allow change 'referer', 'origin', 'cookie'
        if (!chrome.webRequest.onHeadersReceived.hasListener(this.#ModifyResponseHeaders)) {
            chrome.webRequest.onHeadersReceived.addListener(this.#ModifyResponseHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'responseHeaders', 'extraHeaders' ]);
        }

        // TODO: Swith to chrome.declarativeNetRequest
        //       => https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#evaluation
        //       chrome.declarativeWebRequest.onRequest.addRules(...);
        //       chrome.declarativeWebRequest.onRequest.addListener(...);
    }

    async Fetch(request: Request): Promise<Response> {
        // Include empty partition filter since the chrome bug-fix does not work: https://issues.chromium.org/issues/323924496
        const cookies = await chrome.cookies.getAll({ url: new URL(request.url).origin, partitionKey: {} });
        return super.FetchConcealed(request, cookies);
    }

    // See also: app/electron/.../ipc/FetchProvider.ts
    readonly #ModifyRequestHeaders = function ModifyRequestHeaders(this: FetchProviderNW, details: chrome.webRequest.OnBeforeSendHeadersDetails): chrome.webRequest.BlockingResponse {

        const IsConcealed = (name: string) => this.#patternFetchApiSupportedPrefix.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(this.#patternFetchApiSupportedPrefix, '').toLowerCase();

        const all: Array<[string, string]> = details.requestHeaders.map(({ name, value }) => [ name, value ]);
        const result = Object.fromEntries(all.filter(([name]) => !IsConcealed(name)).map(([name, value]) => [name.toLowerCase(), value]));
        const replacements = Object.fromEntries(all.filter(([name]) => IsConcealed(name)).map(([name, value]) => [GetRevealedHeaderName(name), value]));
        replacements.cookie = MergeCookiesIntoHeader(
            ParseCookiesFromHeader(<string>result.cookie ?? ''),
            ParseCookiesFromHeader(<string>replacements.cookie ?? ''),
        );

        for (const name in replacements) {
            result[name] = replacements[name];
        }

        // Remove cookie header when empty
        if (!(<string>result.cookie)?.trim()) delete result.cookie;
        // Prevent leaking HakuNeko's host in certain headers
        if ((<string>result.origin)?.includes(this.appHostname)) delete result.origin;
        if ((<string>result.referer)?.includes(this.appHostname)) delete result.referer;

        return {
            cancel: false,
            requestHeaders: Object.entries(result).map(([name, value]) => ({ name, value })),
        };
    }.bind(this);

    // See also: app/electron/.../ipc/FetchProvider.ts
    readonly #ModifyResponseHeaders = function ModifyResponseHeaders(this: FetchProviderNW, details: chrome.webRequest.OnHeadersReceivedDetails): chrome.webRequest.BlockingResponse {

        const result = Object.fromEntries(details.responseHeaders.map(({ name, value }) => [name.toLowerCase(), value]));

        // Remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
        // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
        if ('link' in result) delete result.link;

        return {
            cancel: false,
            responseHeaders: Object.entries(result).map(([name, value]) => ({ name, value })),
        };
    }.bind(this);
}