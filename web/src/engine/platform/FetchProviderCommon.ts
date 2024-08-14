import protobuf from 'protobufjs';
import { Exception, InternalError } from '../Error';
import { EngineResourceKey as R } from '../../i18n/ILocale';

export type ScriptInjection<T extends void | JSONElement> = string | ((this: Window) => Promise<T>);

export abstract class FetchProvider {

    protected async Wait(delay: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    protected async ValidateResponse(response: Response): Promise<void> {
        // TODO: Investigate why the 'cf_clearance' cookie after manual website interaction is not correctly applied in fetch requests
        if(/challenge/i.test(response.headers.get('CF-Mitigated'))) {
            throw new Exception(R.FetchProvider_Fetch_CloudFlareChallenge, response.url);
        }
        if(response.status === 403) {
            throw new Exception(R.FetchProvider_Fetch_Forbidden, response.url);
        }
    }

    /**
     * ...
     */
    public abstract Initialize(): void;

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
            ?? document.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
            ?? response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
            ?? 'UTF-8';

        document = /UTF-?8/i.test(charset) ? document : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);

        // NOTE: Monkey patching the `innerText` property, stripping whitespaces as it would be rendered when attached to window DOM
        const selectors = [ 'h1', 'h2', 'h3', 'h4', 'div', 'span', 'a', 'li' ].join(', ');
        for(const element of document.body.querySelectorAll<HTMLElement>(selectors)) {
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
    public async FetchJSON<TResult>(request: Request): Promise<TResult> {
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
     * @param operationName - The name of the query to be performed
     * @param query - A valid GraphQL query
     * @param variables - A JSONObject containing the variables of the query.
     */
    //public abstract FetchGraphQL<TResult>(request: Request, operationName: string, query: string, variables: JSONObject): Promise<TResult>;
    public async FetchGraphQL<TResult>(request: Request, operationName: string, query: string, variables: JSONObject): Promise<TResult> {

        const graphQLRequest = new Request(request.url, {
            body: JSON.stringify({ operationName, query, variables }),
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': '*/*'
            },
        });

        //copy custom headers from parent request
        for (const header of request.headers) {
            graphQLRequest.headers.set(header[0], header[1]);
        }

        type GraphQLResult = {
            errors: {
                code: number;
                message: string;
            }[];
            data: TResult;
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
    //public abstract FetchRegex(request: Request, regex: RegExp): Promise<string[]>;
    public async FetchRegex(request: Request, regex: RegExp): Promise<string[]> {
        if (regex.flags.indexOf('g') == -1) {
            throw new InternalError(`The provided RegExp must contain the global 'g' modifier!`);
        }
        const response = await fetch(request);
        const data = await response.text();
        const result : string[] = [];
        let match = undefined;
        while (match = regex.exec(data)) {
            result.push(match[1]);
        }
        return result;
    }

    /**
     * Fetch and decode a protocol buffer message.
     * @param schema - The schema of the protocol buffer including all supported message definitions
     * @param messageTypePath - The name of the package and schema type separated by a `.` which should be used to decode the response
     * @returns The decoded response data
     */
    //public abstract FetchProto<TResult>(request: Request, schema: string, messageTypePath: string) : Promise<TResult>;
    public async FetchProto<TResult>(request: Request, schema: string, messageTypePath: string) : Promise<TResult> {
        const response = await fetch(request);
        const serialized = new Uint8Array(await response.arrayBuffer());
        const prototype = protobuf.parse(schema, { keepCase: true }).root.lookupType(messageTypePath);
        return prototype.decode(serialized).toJSON() as TResult;
    }

    /*
    public async FetchXPATH(request: Request, xpath: string): Promise<Node[]> {
        const dom = await this.FetchHTML(request);
        const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
    }
    */

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public abstract FetchWindowScript<T extends void | JSONElement>(request: Request, script: ScriptInjection<T>, delay?: number, timeout?: number): Promise<T>;

    /**
     * Open the given {@link request} in a new browser window and inject the given {@link script}.
     * @param request - ...
     * @param preload - The JavaScript or function that will be evaluated within the browser window before page is loaded
     * @param script - The JavaScript or function that will be evaluated within the browser window
     * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
     * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
     */
    public abstract FetchWindowPreloadScript<T extends void | JSONElement>(request: Request, preload: ScriptInjection<void>, script: string, delay?: number, timeout?: number): Promise<T>
}