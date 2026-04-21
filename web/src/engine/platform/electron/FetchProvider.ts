import { FetchProvider, ParseCookiesFromHeader, MergeCookies } from '../FetchProviderCommon';
import type { FeatureFlags } from '../../FeatureFlags';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';

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
const concealedCookieHeaderName = fetchApiSupportedPrefix + 'Cookie';

class FetchRequest extends Request {

    readonly #referrer?: string;
    public override get referrer() { return this.#referrer; }

    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if (init?.headers) init.headers = FetchRequest.#ConcealHeaders(init.headers, init.credentials);
        super(input, init);
        this.#referrer = init?.referrer ?? undefined;
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
            // TODO: This will not prevent adding session cookies in main process
            headers.set(concealedCookieHeaderName, '');
            headers.set('Authorization', '');
        }

        return headers;
    }
}

export default class FetchProviderElectron extends FetchProvider {

    #initialized = false;
    private readonly ipc = GetIPC();

    public Initialize(featureFlags: FeatureFlags): void {

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

        // TODO: Monkey patch `globalThis.fetch`?

        this.ipc.Invoke(Channels.FetchProvider.Initialize, fetchApiSupportedPrefix);
    }

    async Fetch(request: Request): Promise<Response> {
        if (request.credentials !== 'omit') {
            const cookie = MergeCookies(
                await this.ipc.Invoke(Channels.FetchProvider.GetSessionCookies, { url: new URL(request.url).origin, /* partitionKey: {} */ }),
                ParseCookiesFromHeader(request.headers.get(concealedCookieHeaderName) ?? ''));
            console.log('Merged Session Cookies:', cookie);
            request.headers.set(concealedCookieHeaderName, cookie);
        }
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const response = await fetch(request);
        await super.ValidateResponse(response);
        return response;
    }
}