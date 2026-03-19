import type {
    WebContents,
    BeforeSendResponse,
    HeadersReceivedResponse,
    OnBeforeSendHeadersListenerDetails,
    OnHeadersReceivedListenerDetails,
} from 'electron';
import type { IPC } from './InterProcessCommunication';
import { FetchProvider as Channels } from '../../../src/ipc/Channels';

export class FetchProvider {

    private fetchApiSupportedPrefix = 'X-FetchAPI-'.toLowerCase();

    constructor(private readonly ipc: IPC<Channels.Web, Channels.App>, private readonly webContents: WebContents) {
        // Set up the response header handler immediately to strip partitioned cookies
        // This must be done before any requests are made to ensure CloudFlare cookies work properly
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
        this.ipc.Listen(Channels.App.Initialize, this.Initialize.bind(this));
    }

    private async Initialize(fetchApiSupportedPrefix: string): Promise<void> {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix.toLowerCase();
        this.webContents.session.webRequest.onBeforeSendHeaders(async (details, callback) => callback(await this.ModifyRequestHeaders(details)));
        // Response handler already set up in constructor, no need to set it again
        this.Initialize = () => Promise.resolve();
    }

    private IsMatchingAppHost(url: string) {
        try {
            const uri = new URL(this.webContents.getURL());
            return new URL(url).hostname === uri.hostname;
        } catch {
            return false;
        }
    }

    private async UpdateCookieHeader(url: string, headers: Record<string, string>) {
        // TODO: Skip cookie assignment in browser window e.g., when `sec-fetch-dest: empty`?
        const normalizedCookieHeaderName = (this.fetchApiSupportedPrefix + 'Cookie').toLowerCase();
        const originalCookieHeaderName = Object.keys(headers).find(header => header.toLowerCase() === normalizedCookieHeaderName) ?? normalizedCookieHeaderName;
        const headerCookies = headers[originalCookieHeaderName]?.split(';').filter(cookie => cookie.includes('=')).map(cookie => cookie.trim()) ?? [];

        // Get all cookies without filtering to include partitioned cookies (e.g., cf_clearance)
        // URL-based filtering in Chromium 126+ excludes partitioned cookies
        // We manually apply RFC 6265 domain/path/secure matching below
        const urlObj = new URL(url);
        const allCookies = await this.webContents.session.cookies.get({});
        const browserCookies = allCookies.filter(cookie => {
            // Apply RFC 6265 domain matching
            // Cookie domain ".example.com" or "example.com" should match "www.example.com"
            const cookieDomain = cookie.domain.startsWith('.') ? cookie.domain.substring(1) : cookie.domain;
            const urlHostname = urlObj.hostname;
            const domainMatches = urlHostname === cookieDomain || urlHostname.endsWith('.' + cookieDomain);

            // Apply RFC 6265 path matching: cookie path must be a prefix of URL path
            // and either match exactly or be followed by '/'
            const pathMatches = urlObj.pathname === cookie.path ||
                urlObj.pathname.startsWith(cookie.path) &&
                 (cookie.path.endsWith('/') || urlObj.pathname[cookie.path.length] === '/');

            // Check if cookie's secure flag is compatible with URL protocol
            const secureMatches = !cookie.secure || urlObj.protocol === 'https:';

            return domainMatches && pathMatches && secureMatches;
        });

        for(const browserCookie of browserCookies) {
            if(!headerCookies.some(cookie => cookie.startsWith(browserCookie.name + '='))) {
                headerCookies.push(`${browserCookie.name}=${browserCookie.value}`);
            }
        }
        if(headerCookies.length > 0) {
            headers[originalCookieHeaderName] = headerCookies.join('; ');
        }
    }

    private async ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): Promise<BeforeSendResponse> {
        const uri = new URL(details.url);
        await this.UpdateCookieHeader(uri.href, details.requestHeaders);
        const updatedHeaders: typeof details.requestHeaders = {
            //origin: uri.origin,
            //referer: uri.href,
        };

        for (const originalHeaderName in details.requestHeaders) {
            const normalizedHeaderName = originalHeaderName.toLowerCase();
            const originalHeaderValue = details.requestHeaders[originalHeaderName];
            if (normalizedHeaderName.startsWith(this.fetchApiSupportedPrefix)) {
                const revealedHeaderName = normalizedHeaderName.replace(this.fetchApiSupportedPrefix, '');
                updatedHeaders[revealedHeaderName] = originalHeaderValue;
            } else {
                updatedHeaders[normalizedHeaderName] = updatedHeaders[normalizedHeaderName] ?? originalHeaderValue;
            }
        }

        // Prevent leaking HakuNeko's host in certain headers
        [ 'origin', 'referer' ].forEach(key => {
            if(key in updatedHeaders && this.IsMatchingAppHost(updatedHeaders[key])) {
                updatedHeaders[key] = uri.origin;
            }
        });

        return {
            cancel: false,
            requestHeaders: updatedHeaders,
        };
    }

    private ModifyResponseHeaders(details: OnHeadersReceivedListenerDetails): HeadersReceivedResponse {
        const responseHeaders: typeof details.responseHeaders = {};
        for (const originalHeader in details.responseHeaders) {
            const normalizedHeader = originalHeader.toLowerCase();
            // remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
            // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
            if (normalizedHeader === 'link') {
                continue;
            }
            // Strip the 'partitioned' attribute from Set-Cookie headers as a workaround
            // This ensures cookies are stored as non-partitioned in the session store
            // Combined with domain-based filtering in UpdateCookieHeader(), this enables
            // proper retrieval and transmission of CloudFlare cookies (e.g., cf_clearance)
            if(normalizedHeader === 'set-cookie') {
                details.responseHeaders[originalHeader] = details.responseHeaders[originalHeader].map(cookie => cookie.replace(/partitioned/gi, ''));
            }
            responseHeaders[originalHeader] = details.responseHeaders[originalHeader];
        }

        /*
        if(details.method.toUpperCase() === 'OPTIONS') {
            responseHeaders['Access-Control-Allow-Origin'] = [ '*' ];
            responseHeaders['Access-Control-Allow-Methods'] = [ '*' ];
            responseHeaders['Access-Control-Allow-Headers'] = [ '*' ];
        }
        */

        return {
            cancel: false,
            responseHeaders,
        };
    }
}