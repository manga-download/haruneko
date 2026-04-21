import type { WebContents, BeforeSendResponse, HeadersReceivedResponse } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';

export class FetchProvider {

    private appHostname = '';
    private fetchApiSupportedPrefix: string = '_';

    constructor (private readonly ipc: IPC, private readonly webContents: WebContents) {
        this.ipc.Handle(Channels.FetchProvider.Initialize, this.Initialize.bind(this));
        this.ipc.Handle(Channels.FetchProvider.GetSessionCookies, this.GetSessionCookies.bind(this));
    }

    private Initialize(fetchApiSupportedPrefix: string): void {
        this.fetchApiSupportedPrefix = fetchApiSupportedPrefix;
        this.appHostname = new URL(this.webContents.getURL()).hostname;
        this.webContents.session.webRequest.onBeforeSendHeaders(async (details, callback) => callback(await this.ModifyRequestHeaders(details.url, details.requestHeaders)));
        this.webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details.responseHeaders ?? {})));
        this.Initialize = () => { };
    }

    private async GetSessionCookies(filter: Electron.CookiesGetFilter) {
        // TODO: When filter by URL partioned cookies may not be found (e.g., cf_clearance)
        return (await this.webContents.session.cookies.get(filter)).map(({ name, value }) => ({ name, value }));
    }

    private ParseCookieFromHeader(cookies: string): CookieList {
        return cookies
            .split(';')
            .filter(cookie => cookie.includes('='))
            .map(cookie => cookie.split('='))
            .map(([name, value]) => ({ name: name.trim(), value: value.trim() }))
            .filter(({ name, value }) => name && value);
    }

    private MergeCookies(...cookieSets: CookieList[]): string {
        const result: Record<string, string> = {};
        for (const cookieSet of cookieSets) {
            for (const { name, value } of cookieSet) {
                if(name && value) result[name] = value;
            }
        }
        return Object.entries(result).map(([ name, value ]) => `${name}=${value}`).join('; '); // TODO: Maybe use `encodeURIComponent(cookie.value)`
    }

    // TODO: Invoke via IPC in WEB
    private async ModifyRequestHeaders(url: string, originalHeaders: Record<string, string | string[]>): Promise<BeforeSendResponse> {

        const patternConcealedHeaderName = new RegExp('^' + this.fetchApiSupportedPrefix, 'i');
        const IsConcealed = (name: string) => patternConcealedHeaderName.test(name);
        const GetRevealedHeaderName = (name: string) => name.replace(patternConcealedHeaderName, '').toLowerCase();

        const all: Array<[string, string | string[]]> = Object.entries(originalHeaders);
        const result = Object.fromEntries(all.filter(([name]) => !IsConcealed(name)).map(([name, value]) => [name.toLowerCase(), value]));
        const replacements = Object.fromEntries(all.filter(([name]) => IsConcealed(name)).map(([name, value]) => [GetRevealedHeaderName(name), value]));
        replacements['cookie'] = this.MergeCookies(
            await this.GetSessionCookies({ url, /* partitionKey: {} */ }), // TODO: Only added for backward-compatibility! Can be removed when session cookies are provided via `replacements['cookie']`
            this.ParseCookieFromHeader(<string>result['cookie'] ?? ''),
            this.ParseCookieFromHeader(<string>replacements['cookie'] ?? ''),
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
    }

    // TODO: Invoke via IPC in WEB
    private ModifyResponseHeaders(originalHeaders: Record<string, string | string[]>): HeadersReceivedResponse {

        const result = Object.fromEntries(Object.entries(originalHeaders).map(([name, value]) => [name.toLowerCase(), value]));

        // Remove the `link` header to prevent prefetch/preload and a corresponding warning about 'resource preloaded but not used',
        // especially when scraping with headless requests (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link)
        if ('link' in result) delete result['link'];
        // Currently electron does not include partitioned cookies when filtering with `session.cookies.get({ url })`
        // => Workaround: Remove the partitioned flag from the server response
        if ('set-cookie' in result) {
            const value = result['set-cookie'];
            result['set-cookie'] = typeof value === 'string' ? value.replace(/partitioned/gi, '') : value.map(cookie => cookie.replace(/partitioned/gi, ''));
        }

        /*
        if(details.method.toUpperCase() === 'OPTIONS') {
            result['Access-Control-Allow-Origin'] = [ '*' ];
            result['Access-Control-Allow-Methods'] = [ '*' ];
            result['Access-Control-Allow-Headers'] = [ '*' ];
            result['Access-Control-Allow-Credentials'] = [ 'true' ];
        }
        */

        return {
            cancel: false,
            responseHeaders: result,
        };
    }
}