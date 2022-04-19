import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as FetchProviderNodeWebkit from './FetchProviderNodeWebkit';
import * as FetchProviderBrowser from './FetchProviderBrowser';

const fail = function() {
    throw new Error();
};

let request: new (input: RequestInfo, init?: RequestInit) => FetchRequest;

export class FetchRequest extends Request {
    public constructor(input: RequestInfo, init?: RequestInit) {
        super(input, init);
        return new request(input, init);
    }
}

let fetch: (request: FetchRequest) => Promise<Response> = fail;
export function Fetch(request: FetchRequest) {
    return fetch(request);
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

let fetchWindowCSS: <T extends HTMLElement>(request: FetchRequest, query: string, delay: number, timeout?: number) => Promise<T[]> = fail;
export function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout?: number): Promise<T[]> {
    return fetchWindowCSS(request, query, delay, timeout);
}

let fetchWindowScript: <T>(request: FetchRequest, script: string, delay: number, timeout?: number) => Promise<T> = fail;
export function FetchWindowScript<T>(request: FetchRequest, script: string, delay = 0, timeout?: number): Promise<T> {
    return fetchWindowScript(request, script, delay, timeout);
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
        return;
    }

    if([ Runtime.Chrome, Runtime.Gecko, Runtime.WebKit ].includes(info.Runtime)) {
        FetchProviderBrowser.Initialize();
        request = FetchProviderBrowser.FetchRequest;
        fetch = FetchProviderNodeWebkit.Fetch;
        fetchHTML = FetchProviderNodeWebkit.FetchHTML;
        fetchJSON = FetchProviderNodeWebkit.FetchJSON;
        fetchCSS = FetchProviderNodeWebkit.FetchCSS;
        fetchWindowCSS = FetchProviderBrowser.FetchWindowCSS;
        fetchWindowScript = FetchProviderBrowser.FetchWindowScript;
        return;
    }

    throw CreateUnsupportedPlatformError(info);
}