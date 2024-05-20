import {
    type WebContents,
    type BeforeSendResponse,
    type HeadersReceivedResponse,
    type OnBeforeSendHeadersListenerDetails,
    type OnHeadersReceivedListenerDetails,
} from 'electron';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with browser windows.
 * @description Send from the Main process and received in the Render process.
 */
export type RendererChannels = never;

/**
 * Supported IPC Channels for interacting with browser windows.
 * @description Send from the Render process and received in the Main process.
 */
export enum MainChannels {
    Initialize = 'FetchProvider::Initialize(fetchApiSupportedPrefix: string)',
};

export class FetchProvider {

    private readonly location: URL;
    private fetchApiSupportedPrefix = 'X-FetchAPI-'.toLowerCase();

    constructor(private readonly ipc: IPC<RendererChannels, MainChannels>, private readonly webContents: WebContents) {
        this.location = new URL(this.webContents.getURL());
        this.ipc.Listen(MainChannels.Initialize, this.Initialize.bind(this));
    }

    public async Initialize(fetchApiSupportedPrefix: string): Promise<void> {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix.toLowerCase();
        this.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => callback(this.ModifyRequestHeaders(details)));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
    }

    private IsMatchingAppHost(url: string) {
        try {
            return new URL(url).hostname === this.location.hostname;
        } catch {
            return false;
        }
    }

    private ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): BeforeSendResponse {
        const uri = new URL(details.url);
        const updatedHeaders: typeof details.requestHeaders = {
            //origin: uri.origin,
            //referer: uri.href,
        };
        for (const originalHeaderName in details.requestHeaders) {
            const normalizedHeaderName = originalHeaderName.toLowerCase();
            const originalHeaderValue = details.requestHeaders[originalHeaderName];
            if(normalizedHeaderName === 'origin' && this.IsMatchingAppHost(originalHeaderValue)) {
                updatedHeaders[normalizedHeaderName] = uri.origin;
            }
            if(normalizedHeaderName === 'referer' && this.IsMatchingAppHost(originalHeaderValue)) {
                updatedHeaders[normalizedHeaderName] = uri.href;
            }
            if (normalizedHeaderName.startsWith(this.fetchApiSupportedPrefix)) {
                const revealedHeaderName = normalizedHeaderName.replace(this.fetchApiSupportedPrefix, '');
                updatedHeaders[revealedHeaderName] = originalHeaderValue;
            } else {
                updatedHeaders[normalizedHeaderName] = updatedHeaders[normalizedHeaderName] ?? originalHeaderValue;
            }
        }
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