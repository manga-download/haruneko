import { FetchProvider } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
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

        for (const name of fetchApiForbiddenHeaders) {
            if (headers.has(name)) {
                headers.set(fetchApiSupportedPrefix + name, headers.get(name));
                headers.delete(name);
            }
        }

        if (credentials?.toLowerCase() === 'omit') {
            headers.set(fetchApiSupportedPrefix + 'Cookie', '');
            headers.set('Authorization', '');
        }

        return headers;
    }
}

export default class FetchProviderElectron extends FetchProvider {

    private readonly ipc = GetIPC();

    public Initialize(featureFlags: FeatureFlags): void {

        super.Initialize(featureFlags);

        // Abuse the global Request type to check if system is already initialized
        if (globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        this.ipc.Send(Channels.FetchProvider.Initialize, fetchApiSupportedPrefix);

        // Register IPC callback for:
        // => main.ipc.Send(Channels.Web.OnBeforeSendHeaders, details))
        // webContents.session.webRequest.onBeforeSendHeaders((details, callback) => this.ModifyRequestHeaders(details).then(callback));

        // => main.ipc.Send(Channels.Web.OnHeadersReceived, details))
        // webContents.session.webRequest.onHeadersReceived((details, callback) => callback(this.ModifyResponseHeaders(details)));
    }

    async Fetch(request: Request): Promise<Response> {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        // Update cookies in request.headers.set('...')
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }

    private async GetSessionCookies(url: string): Promise<string> {
        const sessionCookies = await this.ipc.Send(Channels.FetchProvider.GetSessionCookies, { url, filter: {} });
        return sessionCookies.map(({ name, value }) => `${name}=${value}`).join(';'); // TODO: Maybe use `encodeURIComponent(cookie.value)`
    }

    private RevealHeaders(headers: Headers): Headers {
    }

    private async ModifyRequestHeaders(details: OnBeforeSendHeadersListenerDetails): Promise<BeforeSendResponse> {
    }

    private ModifyResponseHeaders(details: OnHeadersReceivedListenerDetails): HeadersReceivedResponse {
    }
}