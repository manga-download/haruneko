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
        this.ipc.Listen(Channels.App.Initialize, this.Initialize.bind(this));
    }

    private Initialize(fetchApiSupportedPrefix: string): void {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix.toLowerCase();
        this.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => this.ModifyRequestHeaders(details).then(callback));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
        this.Initialize = () => { };
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

    private RevealHeaders(headers: Record<string, string>): Headers {
        const result = new Headers();
        const patternConcealedHeaderName = new RegExp('^' + this.fetchApiSupportedPrefix, 'i');
        const IsHeaderNameConcealed = (name: string) => patternConcealedHeaderName.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '');

        Object.entries(headers)
            .filter(([ name, value ]) => name && value && !IsHeaderNameConcealed(name))
            .forEach(([ name, value ]) => result.append(name, value));

        Object.entries(headers)
            .filter(([ name, value ]) => name && value && IsHeaderNameConcealed(name))
            .forEach(([ name, value ]) => {
                name = GetRevealedHeaderName(name);
                result.set(name, /^cookie$/.test(name) ? this.MergeCookies(result.get(name), value) : value);
            });

        return result;
    }

    private async ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): Promise<BeforeSendResponse> {
        const headers = this.RevealHeaders(details.requestHeaders ?? {});

        // Prevent leaking HakuNeko's host in certain headers
        [ 'origin', 'referer' ].forEach(name => {
            if (headers.get(name)?.startsWith(window.location.origin)) {
                headers.delete(name);
            }
        });

        return {
            cancel: false,
            requestHeaders: Object.fromEntries(headers.entries()),
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
            // Currently electron des not include partitioned cookies when filtering with `session.cookies.get({ url })`
            // => Workaround: Remove the partitioned flag from the server response
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