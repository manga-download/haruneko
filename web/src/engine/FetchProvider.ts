import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as FetchProviderNodeWebkit from './FetchProviderNodeWebkit';
import * as FetchProviderBrowser from './FetchProviderBrowser';
import { InternalError, NotImplementedError } from './Error';

export type PreloadAction = (win: typeof window, frame: typeof window) => void;

export class HttpResponseError extends InternalError {
    constructor(public readonly status: number, message: string) {
        super(message);
    }
}

const fail = function() {
    throw new NotImplementedError();
};

let request: new (input: RequestInfo, init?: RequestInit) => FetchRequest;

export class FetchRequest extends Request {
    public constructor(input: RequestInfo, init?: RequestInit) {
        super(input, init);
        return new request(input, init);
    }
}

let fetch: (request: FetchRequest) => Promise<Response> = fail;
export async function Fetch(request: FetchRequest) {
    const response = await fetch(request);
    if(response.ok) {
        return response;
    } else {
        throw new HttpResponseError(response.status, response.statusText);
    }
}

let fetchHTML: (request: FetchRequest) => Promise<Document> = fail;
export function FetchHTML(request: FetchRequest): Promise<Document> {
    return fetchHTML(request);
}

let fetchJSON: <TResult>(request: FetchRequest) => Promise<TResult> = fail;
export function FetchJSON<TResult>(request: FetchRequest): Promise<TResult> {
    return fetchJSON<TResult>(request);
}

let fetchCSS: <T extends HTMLElement>(request: FetchRequest, query: string) => Promise<T[]> = fail;
export function FetchCSS<T extends HTMLElement>(request: FetchRequest, query: string): Promise<T[]> {
    return fetchCSS<T>(request, query);
}

let fetchGraphQL: <TResult>(request: FetchRequest, operationName: string, query: string, variables : string) => Promise<TResult> = fail;
export function FetchGraphQL<TResult>(request: FetchRequest, operationName: string, query: string, variables : string): Promise<TResult> {
    return fetchGraphQL(request, operationName, query, variables);
}

let fetchRegex: (request: FetchRequest, regex: RegExp) => Promise<string[]> = fail;
export function FetchRegex(request: FetchRequest, regex: RegExp) {
    return fetchRegex(request, regex);
}

let fetchProto: <TResult>(request: FetchRequest, prototypes: string, responsetype: string) => Promise<TResult> = fail;
export function FetchProto<TResult>(request: FetchRequest, prototypes: string, responsetype: string): Promise<TResult> {
    return fetchProto(request, prototypes, responsetype);
}

let fetchWindowCSS: <T extends HTMLElement>(request: FetchRequest, query: string, delay: number, timeout?: number) => Promise<T[]> = fail;
/**
 * Open the given {@link request} in a new browser window and execute the given {@link query}.
 * @param request - ...
 * @param query - The CSS query that will be performed for the DOM of the browser window
 * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link query} will be executed
 * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
 */
export function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout?: number): Promise<T[]> {
    return fetchWindowCSS(request, query, delay, timeout);
}

let fetchWindowScript: <T>(request: FetchRequest, script: string, delay: number, timeout?: number) => Promise<T> = fail;
/**
 * Open the given {@link request} in a new browser window and inject the given {@link script}.
 * @param request - ...
 * @param script - The JavaScript that will be evaluated within the browser window
 * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
 * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
 */
export function FetchWindowScript<T>(request: FetchRequest, script: string, delay = 0, timeout?: number): Promise<T> {
    return fetchWindowScript(request, script, delay, timeout);
}

let fetchWindowPreloadScript: <T>(request: FetchRequest, preload: PreloadAction, script: string, delay: number, timeout?: number) => Promise<T> = fail;
/**
 * Open the given {@link request} in a new browser window and inject the given {@link script}.
 * @param request - ...
 * @param preload - ...
 * @param script - The JavaScript that will be evaluated within the browser window
 * @param delay - The time [ms] to wait after the window was fully loaded and before the {@link script} will be injected
 * @param timeout - The maximum time [ms] to wait for the result before a timeout error is thrown (excluding the {@link delay})
 */
export function FetchWindowPreloadScript<T>(request: FetchRequest, preload: PreloadAction, script: string, delay = 0, timeout?: number): Promise<T> {
    return fetchWindowPreloadScript(request, preload, script, delay, timeout);
}

export function Initialize(info?: PlatformInfo): void {

    info = info ?? DetectPlatform();

    if(info.Runtime === Runtime.NodeWebkit) {
        FetchProviderNodeWebkit.Initialize();
        request = FetchProviderNodeWebkit.FetchRequest;
        fetch = FetchProviderNodeWebkit.Fetch;
        fetchHTML = FetchProviderNodeWebkit.FetchHTML;
        fetchJSON = FetchProviderNodeWebkit.FetchJSON;
        fetchCSS = FetchProviderNodeWebkit.FetchCSS;
        fetchWindowCSS = FetchProviderNodeWebkit.FetchWindowCSS;
        fetchWindowScript = FetchProviderNodeWebkit.FetchWindowScript;
        fetchWindowPreloadScript = FetchProviderNodeWebkit.FetchWindowPreloadScript;
        fetchGraphQL = FetchProviderNodeWebkit.FetchGraphQL;
        fetchRegex = FetchProviderNodeWebkit.FetchRegex;
        fetchProto = FetchProviderNodeWebkit.FetchProto;
        return;
    }

    if([ Runtime.Chrome, Runtime.Gecko, Runtime.WebKit ].includes(info.Runtime)) {
        FetchProviderBrowser.Initialize();
        request = FetchProviderBrowser.FetchRequest;
        fetch = FetchProviderBrowser.Fetch;
        fetchHTML = FetchProviderNodeWebkit.FetchHTML;
        fetchJSON = FetchProviderNodeWebkit.FetchJSON;
        fetchCSS = FetchProviderNodeWebkit.FetchCSS;
        fetchWindowCSS = FetchProviderBrowser.FetchWindowCSS;
        fetchWindowScript = FetchProviderBrowser.FetchWindowScript;
        fetchWindowPreloadScript = FetchProviderBrowser.FetchWindowPreloadScript;
        fetchGraphQL = FetchProviderNodeWebkit.FetchGraphQL;
        fetchRegex = FetchProviderNodeWebkit.FetchRegex;
        fetchProto = FetchProviderNodeWebkit.FetchProto;
        return;
    }

    throw CreateUnsupportedPlatformError(info);
}