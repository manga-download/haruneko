export const FetchApiSupportedPrefix = 'X-FetchAPI-';
export const ConcealedCookieHeaderName = `${FetchApiSupportedPrefix}Cookie`;

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
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

/**
 * A dedicated `Request` type when fetching with Blink based clients.
 * This `Request` type allows the usage of forbidden headers by concealing.
 */
export class FetchConcealedRequest extends Request {

    readonly #referrer?: string;
    public override get referrer() { return this.#referrer; }

    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if (init?.headers) init.headers = FetchConcealedRequest.#ConcealHeaders(init.headers);
        super(input, init);
        this.#referrer = init?.referrer ?? undefined;
    }

    static #ConcealHeaders(init: HeadersInit): Headers {
        const headers = new Headers(init);

        for (const name of fetchApiForbiddenHeaders) {
            if (headers.has(name)) {
                headers.set(FetchApiSupportedPrefix + name, headers.get(name));
                headers.delete(name);
            }
        }

        return headers;
    }
}