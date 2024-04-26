import {
    ipcMain,
    type WebContents,
    type BeforeSendResponse,
    type HeadersReceivedResponse,
    type OnBeforeSendHeadersListenerDetails,
    type OnHeadersReceivedListenerDetails,
} from 'electron';

export class FetchProvider {

    private fetchApiSupportedPrefix = 'X-FetchAPI-'.toLowerCase();

    constructor(private readonly webContents: WebContents) {
        ipcMain.handle('FetchProvider::Initialize', (_, fetchApiSupportedPrefix: string) => this.Initialize(fetchApiSupportedPrefix));
    }

    public async Initialize(fetchApiSupportedPrefix: string) {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix.toLowerCase();
        this.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => callback(this.ModifyRequestHeaders(details)));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
    }

    private ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): BeforeSendResponse {
        const requestHeaders: typeof details.requestHeaders = {
            //referer: details.url,
        };
        for (const originalHeader in details.requestHeaders) {
            const normalizedHeader = originalHeader.toLowerCase();
            if (normalizedHeader === 'origin' || normalizedHeader === 'referer') {
                continue;
            }
            const revealedHeader = normalizedHeader.replace(this.fetchApiSupportedPrefix, '');
            if (revealedHeader === normalizedHeader) {
                requestHeaders[revealedHeader] = requestHeaders[revealedHeader] ?? details.requestHeaders[originalHeader];
            } else {
                requestHeaders[revealedHeader] = details.requestHeaders[originalHeader];
            }
        }
        return {
            cancel: false,
            requestHeaders,
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