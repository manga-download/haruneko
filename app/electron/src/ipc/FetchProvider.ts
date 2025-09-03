import type {
    WebContents,
    BeforeSendResponse,
    HeadersReceivedResponse,
    OnBeforeSendHeadersListenerDetails,
    OnHeadersReceivedListenerDetails,
} from 'electron';
import { type IPC, Channels } from './InterProcessCommunication';

export class FetchProvider {

    private appHostname = '';
    private fetchApiSupportedPrefix: string;

    constructor (private readonly ipc: IPC, private readonly webContents: WebContents) {
        this.ipc.Listen(Channels.FetchProvider.Initialize, this.Initialize.bind(this));
    }

    private Initialize(fetchApiSupportedPrefix: string): void {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix;
        this.appHostname = new URL(this.webContents.getURL()).hostname;
        this.webContents.session.webRequest.onBeforeSendHeaders(async (details, callback) => callback(await this.ipc.Send(Channels.FetchProvider.OnBeforeSendHeaders, details.url, details.requestHeaders)));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
        this.Initialize = () => { };
    }

    private async GetSessionCookies(url: string): Promise<string> {
        const sessionCookies = await this.webContents.session.cookies.get({ url, /* partitionKey: {} */ }); // TODO: When filter by URL partioned cookies may not be found (e.g., cf_clearance)
        return sessionCookies.map(({ name, value }) => `${name}=${value}`).join(';'); // TODO: Maybe use `encodeURIComponent(cookie.value)`
    }

    private RevealHeaders(headers: Headers): Headers {
        const result = new Headers();
        const patternConcealedHeaderName = new RegExp('^' + this.fetchApiSupportedPrefix, 'i');
        const IsHeaderNameConcealed = (name: string) => patternConcealedHeaderName.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '');

        Object.entries(headers)
            .filter(([ name, value ]) => name && value && !IsHeaderNameConcealed(name))
            .forEach(([ name, value ]) => result.append(name, value));

        Object.entries(headers)
            .filter(([ name, value ]) => name && value && IsHeaderNameConcealed(name))
            .forEach(([ name, value ]) => result.set(GetRevealedHeaderName(name), value));

        return result;
    }

    // TODO: Invoke via IPC in WEB
    private async ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): Promise<BeforeSendResponse> {
        const requestHeaders = new Headers(details.requestHeaders ?? {});
        requestHeaders.set('cookie', await this.GetSessionCookies(details.url));
        const headers = this.RevealHeaders(requestHeaders);

        // Remove certain headers when empty
        [ 'cookie' ].forEach(name => headers.has(name) && !headers.get(name)?.trim() ? headers.delete(name) : null);

        // Prevent leaking HakuNeko's host in certain headers
        [ 'origin', 'referer' ].forEach(name => headers.get(name)?.includes(this.appHostname) ? headers.delete(name) : null);

        return {
            cancel: false,
            requestHeaders: Object.fromEntries(headers.entries()),
        };
    }

    // TODO: Invoke via IPC in WEB
    private ModifyResponseHeaders(details: OnHeadersReceivedListenerDetails): HeadersReceivedResponse {
        const responseHeaders: typeof details.responseHeaders = {};
        for (const originalHeader in details.responseHeaders) {
            const normalizedHeader = originalHeader.toLowerCase();

            // Remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
            // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
            if (normalizedHeader === 'link') {
                continue;
            }

            // Currently electron des not include partitioned cookies when filtering with `session.cookies.get({ url })`
            // => Workaround: Remove the partitioned flag from the server response
            if(normalizedHeader === 'set-cookie') {
                details.responseHeaders[ normalizedHeader ] = details.responseHeaders[ originalHeader ].map(cookie => cookie.replace(/partitioned/gi, ''));
            }

            responseHeaders[ normalizedHeader ] = details.responseHeaders[ originalHeader ];
        }

        /*
        if(details.method.toUpperCase() === 'OPTIONS') {
            responseHeaders['Access-Control-Allow-Origin'] = [ '*' ];
            responseHeaders['Access-Control-Allow-Methods'] = [ '*' ];
            responseHeaders['Access-Control-Allow-Headers'] = [ '*' ];
            responseHeaders['Access-Control-Allow-Credentials'] = [ 'true' ];
        }
        */

        return {
            cancel: false,
            responseHeaders,
        };
    }
}