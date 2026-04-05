import type { WebContents, BeforeSendResponse, HeadersReceivedResponse } from 'electron';
import { type IPC, Channels } from './InterProcessCommunication';

export class FetchProvider {

    private appHostname = '';
    private fetchApiSupportedPrefix: string = '_';

    constructor (private readonly ipc: IPC, private readonly webContents: WebContents) {
        this.ipc.Handle(Channels.FetchProvider.Initialize, this.Initialize.bind(this));
    }

    private Initialize(fetchApiSupportedPrefix: string): void {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix;
        this.appHostname = new URL(this.webContents.getURL()).hostname;
        this.webContents.session.webRequest.onBeforeSendHeaders(async (details, callback) => callback(await this.ModifyRequestHeaders(details.url, details.requestHeaders)));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details.responseHeaders ?? {})));
        this.Initialize = () => { };
    }

    private async GetSessionCookies(url: string): Promise<string> {
        const sessionCookies = await this.webContents.session.cookies.get({ url, /* partitionKey: {} */ }); // TODO: When filter by URL partioned cookies may not be found (e.g., cf_clearance)
        return sessionCookies.map(({ name, value }) => `${name}=${value}`).join(';'); // TODO: Maybe use `encodeURIComponent(cookie.value)`
    }

    private RevealHeaders(headers: Headers): Headers {
        const result = new Headers();
        const patternConcealedHeaderName = new RegExp('^' + this.fetchApiSupportedPrefix, 'i');
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '');

        for (const name in headers) {
            result.set(GetRevealedHeaderName(name), headers.get(name) ?? '');
        }

        return result;
    }

    // TODO: Invoke via IPC in WEB
    private async ModifyRequestHeaders(url: string, originalHeaders: Record<string, string>): Promise<BeforeSendResponse> {
        const headers = new Headers(originalHeaders);
        headers.set('cookie', await this.GetSessionCookies(url));
        const requestHeaders = this.RevealHeaders(headers);

        // Remove certain headers when empty
        for (const name of ['cookie']) {
            if (requestHeaders.get(name)?.trim() === '') requestHeaders.delete(name);
        }

        // Prevent leaking HakuNeko's host in certain headers
        for (const name of [ 'origin', 'referer' ]) {
            if (requestHeaders.get(name)?.includes(this.appHostname)) requestHeaders.delete(name);
        }

        return {
            cancel: false,
            requestHeaders: Object.fromEntries(requestHeaders.entries()),
        };
    }

    // TODO: Invoke via IPC in WEB
    private ModifyResponseHeaders(originalHeaders?: Record<string, string[]>): HeadersReceivedResponse {
        const responseHeaders: Record<string, string[]> = {};
        for (const originalHeader in originalHeaders) {
            const normalizedHeader = originalHeader.toLowerCase();

            // Remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
            // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
            if (normalizedHeader === 'link') {
                continue;
            }

            // Currently electron des not include partitioned cookies when filtering with `session.cookies.get({ url })`
            // => Workaround: Remove the partitioned flag from the server response
            if(normalizedHeader === 'set-cookie') {
                originalHeaders[normalizedHeader] = originalHeaders[originalHeader].map(cookie => cookie.replace(/partitioned/gi, ''));
            }

            responseHeaders[normalizedHeader] = originalHeaders[originalHeader];
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