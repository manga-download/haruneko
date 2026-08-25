import protobuf from 'protobufjs';
import { Exception, InternalError } from '../Error';
import { EngineResourceKey as R } from '../../i18n/ILocale';
import { CreateRemoteBrowserWindow } from './RemoteBrowserWindow';
import { CheckAntiScrapingDetection, FetchRedirection } from './AntiScrapingDetection';
import type { FeatureFlags } from '../FeatureFlags';
import { Delay, SetTimeout, ClearTimeout } from '../BackgroundTimers';
import { GetBytesFromBase64, GetUTF8FromBytes } from '../BufferEncoder';

const INLINE_FLIGHT_PAYLOAD_BOOTSTRAP = 0;
const INLINE_FLIGHT_PAYLOAD_DATA = 1;
// const INLINE_FLIGHT_PAYLOAD_FORM_STATE = 2;
const INLINE_FLIGHT_PAYLOAD_BINARY = 3;

type NextData<T> = {
    props: {
        pageProps: T;
    };
};

export abstract class FetchProvider {

    private featureFlags: FeatureFlags;

    protected async ValidateResponse(response: Response): Promise<void> {
        if (/challenge/i.test(response.headers.get('CF-Mitigated'))) {
            throw new Exception(R.FetchProvider_Fetch_CloudFlareChallenge, response.url);
        }
        if (/challenge/i.test(response.headers.get('X-Vercel-Mitigated'))) {
            throw new Exception(R.FetchProvider_Fetch_VercelChallenge, response.url);
        }
        if (response.status === 403) {
            throw new Exception(R.FetchProvider_Fetch_Forbidden, response.url);
        }
    }

    /**
     * ...
     */
    public Initialize(featureFlags: FeatureFlags): void {
        this.featureFlags = featureFlags;
    }

    /**
     * ...
     * @param request - ...
     */
    public abstract Fetch(request: Request): Promise<Response>;

    /**
     * Fetch and parse the remote HTML content into a virtual {@link Document} for further processing.
     * @param request - The request used to fetch the remote content.
     * @returns A virtual DOM with limited capabilities:
     *   - Since the document is detached it will not be rendered, therefore certain behavior may not be as expected (e.g., innerText is the same as textContent)
     *   - The document uses the base URL of the application instead of `request.url`, which affects all expanded links in the document
     */
    public async FetchHTML(request: Request): Promise<Document> {
        const mime = 'text/html';
        const charsetPattern = /charset=([\w-]+)/;

        const response = await this.Fetch(request);
        const data = await response.arrayBuffer();
        let document = new DOMParser().parseFromString(new TextDecoder().decode(data), mime);

        const charset = document.head?.querySelector<HTMLMetaElement>('meta[charset]')?.getAttribute('charset')
            || document.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
            || response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
            || 'UTF-8';

        document = /UTF-?8/i.test(charset) ? document : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);

        // NOTE: Monkey patching the `innerText` property, stripping whitespaces as it would be rendered when attached to window DOM
        const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'div', 'span', 'a', 'li'].join(', ');
        for (const element of document.body.querySelectorAll<HTMLElement>(selectors)) {
            Object.defineProperty(element, 'innerText', {
                get: () => element.textContent?.replace(/\s+/g, ' ').trim()
            });
        }

        return document;
    }

    /**
     * ...
     * @param request - ...
     */
    public async FetchJSON<T extends JSONElement>(request: Request): Promise<T> {
        const response = await this.Fetch(request);
        return response.json();
    }

    /**
     * ...
     * @param request - ...
     * @param query - ...
     */
    public async FetchCSS<T extends HTMLElement>(request: Request, query: string): Promise<T[]> {
        const dom = await this.FetchHTML(request);
        return [...dom.querySelectorAll(query)] as T[];
    }

    /**
     * Perform a GraphQL request (POST) to a desired endpoint and returns JSON data.
     * @param operationName - The name of the query to be performed or `undefined` for unnamed queries
     * @param query - A valid GraphQL query
     * @param variables - A JSONObject containing the variables of the query.
     * @param extensions - ...
     */
    public async FetchGraphQL<T extends JSONElement>(request: Request, operationName: string, query: string | undefined, variables: JSONObject, extensions: JSONObject | undefined = undefined): Promise<T> {

        const graphQLRequest = new Request(request.url, {
            method: 'POST',
            body: JSON.stringify({ operationName, query, variables, extensions }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        });

        // NOTE: Copy custom headers from parent request
        for (const header of request.headers) {
            graphQLRequest.headers.set(header.at(0), header.at(1));
        }

        type GraphQLResult = {
            errors: {
                code: number;
                message: string;
            }[];
            data: T;
        };

        const data = await this.FetchJSON<GraphQLResult>(graphQLRequest);
        if (data.errors && data.errors.length > 0) {
            throw new Exception(R.FetchProvider_FetchGraphQL_AggregateError, data.errors.map(error => error.message).join('\n'));
        }
        if (!data.data) {
            throw new Exception(R.FetchProvider_FetchGraphQL_MissingDataError);
        }
        return data.data;
    }

    /**
     * ...
     * @param request - ...
     * @param regex - ...
     */
    public async FetchRegex(request: Request, regex: RegExp): Promise<string[]> {
        if (regex.flags.indexOf('g') === -1) {
            throw new InternalError(`The provided RegExp must contain the global 'g' modifier!`);
        }
        const response = await fetch(request);
        const data = await response.text();
        const result: string[] = [];
        let match = undefined;
        while (match = regex.exec(data)) {
            result.push(match.at(1));
        }
        return result;
    }

    /**
     * Fetch and decode a protocol buffer message.
     * @param schema - The schema of the protocol buffer including all supported message definitions
     * @param messageTypePath - The name of the package and schema type separated by a `.` which should be used to decode the response
     * @returns The decoded response data
     */
    public async FetchProto<T extends JSONElement>(request: Request, schema: string, messageTypePath: string): Promise<T> {
        const response = await fetch(request);
        const serialized = new Uint8Array(await response.arrayBuffer());
        const prototype = protobuf.parse(schema, { keepCase: true }).root.lookupType(messageTypePath);
        return prototype.decode(serialized).toJSON() as T;
    }

    /*
    public async FetchXPATH(request: Request, xpath: string): Promise<Node[]> {
        const dom = await this.FetchHTML(request);
        const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
    }
    */

    /**
     * Extract all NextJS hydrated flight data payloads from the HTML script tags of the provided {@link request}
     * and returns the first nested data element that fulfills the given {@link predicate} or `undefined` if non was found.
     */
    public async FetchNextJS<T extends JSONElement>(request: Request, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): Promise<T | undefined> {
        return this.ExtractNextJS<T>(await this.FetchHTML(request), predicate);
    }

    /**
     * NextJS Flight Data extractor & search
     * Extraction part from https://github.com/alcoceba/next.js-explorer
    */
    private ExtractNextJS<T extends JSONElement>(document: Document, predicate: (data: JSONObject<JSONElement> | JSONArray<JSONElement>) => unknown): T | undefined {
        const rawData = this.NextJSGetRawdata(document);
        const payloads = this.NextJSDecodeData(rawData);

        function search(target: any): T | undefined {
            if (target === null || target === undefined) return undefined;

            //make the predicate fails gracefully.
            //i.e predicate  = ( data => 'something' in data) and target is not an object (string number etc..)
            try {
                if (predicate(target)) {
                    return target as T;
                }
            } catch { };

            if (typeof target === 'object') {
                for (const key of Object.keys(target)) {
                    const result = search(target[key]);
                    if (result !== undefined) {
                        return result; // Short-circuit on first find
                    }
                }
            }
            return undefined;
        }

        // Iterate over the root Record<number, any> entries
        if (payloads && typeof payloads === 'object') {
            for (const key of Object.keys(payloads)) {
                const result = search(payloads[key]);
                if (result !== undefined) {
                    return result as T;
                }
            }
        }
        return undefined;
    }

    private NextJSGetRawdata(doc: Document): JSONElement {
        const scriptTags = doc.querySelectorAll('script');
        const flightData: any[] = [];

        for (const script of scriptTags) {
            const content = script.textContent || '';
            const args = this.NextJSParsePushCalls(content);

            for (const arg of args) {
                try {
                    const parsed = JSON.parse(arg);
                    flightData.push(parsed);
                } catch {
                    try {
                        const parsed = new Function('return ' + arg)();
                        if (Array.isArray(parsed)) {
                            flightData.push(parsed);
                        }
                    } catch {
                        // Skip malformed entries
                    }
                }
            }
        }
        return flightData;
    }

    private NextJSDecodeData(appRawData: any): JSONElement | null {
        if (appRawData) {
            const flightRawData: string[] = [];

            for (const chunk of appRawData) {
                // Next.js 16+ format: tuples like [0], [1, "data"], [2, formState], [3, "base64"]
                if (Array.isArray(chunk)) {
                    const [type, data] = chunk;

                    // Bootstrap marker - skip
                    if (type === INLINE_FLIGHT_PAYLOAD_BOOTSTRAP) {
                        continue;
                    }

                    // Text data chunk (most common)
                    if (type === INLINE_FLIGHT_PAYLOAD_DATA && typeof data === 'string') {
                        flightRawData.push(data);
                        continue;
                    }

                    // Binary data chunk (base64 encoded) - Next.js 16+
                    if (type === INLINE_FLIGHT_PAYLOAD_BINARY && typeof data === 'string') {
                        const decoded = GetUTF8FromBytes(GetBytesFromBase64(data));
                        if (decoded) {
                            flightRawData.push(decoded);
                        }
                        continue;
                    }

                    // Fallback for older Next.js 15 format or unknown tuple formats:
                    // Try to extract any string data from the array
                    for (const inner of chunk) {
                        if (typeof inner === 'string') {
                            flightRawData.push(inner);
                        }
                    }
                } else if (typeof chunk === 'string') {
                    // Legacy format: direct strings in the array
                    flightRawData.push(chunk);
                }
            }

            // Join without adding extra newlines - the data already contains proper line breaks
            const flightString = flightRawData.join('');

            return this.NextJSParseFlightPushData(flightString);
        }
        return null;
    }

    private NextJSParsePushCalls(content: string): string[] {
        const args: string[] = [];
        const prefix = 'self.__next_f.push(';
        let searchStart = 0;

        while (true) {
            const callIndex = content.indexOf(prefix, searchStart);
            if (callIndex === -1) break;

            const openParen = callIndex + prefix.length;
            let depth = 0;
            let inString = false;
            let stringChar: string | null = null;
            let escape = false;
            let i = openParen;

            for (; i < content.length; i++) {
                const ch = content[i];

                if (escape) {
                    escape = false;
                    continue;
                }

                if (ch === '\\') {
                    escape = true;
                    continue;
                }

                if (inString) {
                    if (ch === stringChar) inString = false;
                    continue;
                }

                if (ch === '"' || ch === "'") {
                    inString = true;
                    stringChar = ch;
                    continue;
                }

                if (ch === '(') {
                    depth++;
                } else if (ch === ')') {
                    if (depth === 0) break;
                    depth--;
                }
            }

            args.push(content.slice(openParen, i));
            searchStart = i + 1;
        }
        return args;
    }

    private NextJSParseFlightPushData(flightChunk: string): any[] | undefined {
        if (typeof flightChunk !== 'string') {
            return;
        }

        const parsed: any[] = [];
        let pos = 0;
        const len = flightChunk.length;

        const readUntilNewline = (start: number): { line: string; nextPos: number } => {
            const end = flightChunk.indexOf('\n', start);
            return {
                line: flightChunk.slice(start, end === -1 ? len : end),
                nextPos: end === -1 ? len : end + 1,
            };
        };

        while (pos < len) {
            // Skip empty/whitespace-only lines
            if (flightChunk[pos] === '\n') {
                pos++;
                continue;
            }

            const colonIndex = flightChunk.indexOf(':', pos);
            if (colonIndex === -1) {
                break;
            }

            const key = flightChunk.slice(pos, colonIndex);
            if (!/^\w+$/.test(key)) {
                // Malformed key; skip to the next newline and try again
                const nextNewline = flightChunk.indexOf('\n', pos);
                pos = nextNewline === -1 ? len : nextNewline + 1;
                continue;
            }

            const afterColon = colonIndex + 1;
            if (afterColon >= len) {
                break;
            }

            const typeChar = flightChunk[afterColon];

            // Symbol reference (e.g., "$Sreact.fragment", "$SR19")
            if (typeChar === '"') {
                const { line, nextPos } = readUntilNewline(afterColon);
                const value = line.slice(1, -1);
                const type = line.startsWith('"$S') ? 'Symbol' : 'Data';
                if (type === 'Symbol') {
                    parsed.push({ type, key, value });
                } else {
                    try {
                        parsed.push({ type: 'Data', key, content: JSON.parse(line) });
                    } catch {
                        parsed.push({ type: 'Unknown', key, value: line });
                    }
                }
                pos = nextPos;
            }
            // Text content
            else if (typeChar === 'T') {
                if (flightChunk[afterColon + 1] === '"') {
                    // Legacy quoted format: T"text"
                    const { line, nextPos } = readUntilNewline(afterColon);
                    parsed.push({ type: 'Text', key, value: line.slice(2, -1) });
                    pos = nextPos;
                } else {
                    // Length-prefixed format: T<hex_len>,<text>
                    const commaIndex = flightChunk.indexOf(',', afterColon);
                    if (commaIndex === -1) {
                        // Malformed; fall back to consuming the rest of the line
                        const { line, nextPos } = readUntilNewline(afterColon);
                        parsed.push({ type: 'Text', key, value: line.slice(1) });
                        pos = nextPos;
                        continue;
                    }

                    const hexLen = flightChunk.slice(afterColon + 1, commaIndex);
                    const length = parseInt(hexLen, 16);
                    const textStart = commaIndex + 1;

                    // Extract exactly `length` UTF-8 bytes from the remaining string.
                    // Each JS character needs at most 4 UTF-8 bytes, so a window of
                    // `length` characters is guaranteed to cover `length` bytes.
                    const remainingChars = len - textStart;
                    const maxChars = Math.min(remainingChars, length);
                    const windowStr = flightChunk.slice(textStart, textStart + maxChars);
                    const windowBytes = new TextEncoder().encode(windowStr);

                    let text: string;
                    if (windowBytes.length < length) {
                        // Not enough bytes left; take everything we have
                        text = flightChunk.slice(textStart);
                        pos = len;
                    } else {
                        const textBytes = windowBytes.slice(0, length);
                        text = new TextDecoder().decode(textBytes);
                        pos = textStart + text.length;
                    }

                    parsed.push({ type: 'Text', key, length, value: text });

                    // Text rows may optionally be followed by a newline
                    if (pos < len && flightChunk[pos] === '\n') {
                        pos++;
                    }
                }
            }
            // Instance/Import reference
            else if (typeChar === 'I') {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const content = JSON.parse(line.slice(1));
                    parsed.push({ type: 'Instance', key, content });
                } catch {
                    parsed.push({ type: 'Instance', key, raw: line });
                }
                pos = nextPos;
            }
            // List/Array
            else if (typeChar === 'L') {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const list = JSON.parse(line.slice(1));
                    parsed.push({ type: 'List', key, content: list });
                } catch {
                    parsed.push({ type: 'List', key, raw: line });
                }
                pos = nextPos;
            }
            // Object
            else if (typeChar === 'O') {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const obj = JSON.parse(line.slice(1));
                    parsed.push({ type: 'Object', key, content: obj });
                } catch {
                    parsed.push({ type: 'Object', key, raw: line });
                }
                pos = nextPos;
            }
            // Hints (Next.js 16+ for preloading resources)
            else if (typeChar === 'H') {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const hints = JSON.parse(line.slice(1));
                    parsed.push({ type: 'Hints', key, content: hints });
                } catch {
                    parsed.push({ type: 'Hints', key, raw: line });
                }
                pos = nextPos;
            }
            // Binary/Blob reference (Next.js 16+)
            else if (typeChar === 'B') {
                const { line, nextPos } = readUntilNewline(afterColon);
                parsed.push({ type: 'Binary', key, raw: line });
                pos = nextPos;
            }
            // Module reference (for lazy loading)
            else if (typeChar === 'M') {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const module = JSON.parse(line.slice(1));
                    parsed.push({ type: 'Module', key, content: module });
                } catch {
                    parsed.push({ type: 'Module', key, raw: line });
                }
                pos = nextPos;
            }
            // Default: try to parse as JSON
            else {
                const { line, nextPos } = readUntilNewline(afterColon);
                try {
                    const data = JSON.parse(line);
                    parsed.push({ type: 'Data', key, content: data });
                } catch {
                    parsed.push({ type: 'Unknown', key, value: line });
                }
                pos = nextPos;
            }
        }
        return parsed;
    }

    /**
     * Extract __NEXT_DATA__ props from the HTML script tags of the provided {@link request}
     */
    public async FetchNextProps<T extends JSONElement>(request: Request): Promise<T> {
        const [{ text }] = await this.FetchCSS<HTMLScriptElement>(request, 'script#__NEXT_DATA__');
        const nextData = <NextData<T>>JSON.parse(text);
        return nextData.props.pageProps;
    }

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public async FetchWindowScript<T extends void | JSONElement>(request: Request, script: string, delay?: number, timeout?: number): Promise<T> {
        return this.FetchWindowPreloadScript<T>(request, ``, script, delay, timeout);
    }

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param preload - The JavaScript or function that will be evaluated within the browser window before page is loaded
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public async FetchWindowPreloadScript<T extends void | JSONElement>(request: Request, preload: string, script: string, delay = 0, timeout = 60_000): Promise<T> {

        const invocations: {
            name: string;
            info: string;
        }[] = [];

        const win = CreateRemoteBrowserWindow();

        win.BeforeWindowNavigate.Subscribe(async uri => {
            invocations.push({ name: 'BeforeNavigate', info: `URL: ${uri.href}` });
            return this.featureFlags.VerboseFetchWindow.Value ? null : win.Hide();
        });

        const destroy = async () => {
            try {
                if (this.featureFlags.VerboseFetchWindow.Value) {
                    console.log('FetchWindow()::invocations', invocations);
                } else {
                    win.Close();
                }
            } catch (error) {
                console.warn(error);
            }
        };

        return new Promise<T>(async (resolve, reject) => {
            let cancellation = await SetTimeout(async () => {
                await destroy();
                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
            }, timeout);

            win.DOMReady.Subscribe(async () => {
                invocations.push({ name: 'DOMReady', info: `Window: ${win}` });
                try {
                    const redirect = await CheckAntiScrapingDetection(win, request.url);
                    invocations.push({ name: 'performRedirectionOrFinalize()', info: `Mode: ${FetchRedirection[redirect]}` });
                    switch (redirect) {
                        case FetchRedirection.Interactive:
                            // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                            ClearTimeout(cancellation);
                            cancellation = await SetTimeout(() => {
                                destroy();
                                reject(new Exception(R.FetchProvider_FetchWindow_TimeoutError));
                            }, 150_000);
                            await win.Show();
                            break;
                        case FetchRedirection.Automatic:
                            break;
                        default:
                            ClearTimeout(cancellation);
                            await Delay(delay);
                            const result = await win.ExecuteScript<T>(script);
                            await destroy();
                            resolve(result);
                    }
                } catch {
                    await destroy();
                }
            });

            invocations.push({ name: 'Open', info: `Request URL: ${request.url}` });
            await win.Open(request, this.featureFlags.VerboseFetchWindow.Value, preload);
        });
    }
}