import { type PlatformInfo, Runtime, DetectPlatform, CreateUnsupportedPlatformError } from './Platform';
import * as FetchProviderNodeWebkit from './FetchProviderNodeWebkit';
import * as FetchProviderBrowser from './FetchProviderBrowser';

let request: new (input: RequestInfo, init?: RequestInit) => FetchRequest;

export class FetchRequest extends Request {
    public constructor(input: RequestInfo, init?: RequestInit) {
        return new request(input, init);
        super(input, init);
    }
}

let fetch = function(_request: FetchRequest): Promise<Response> {
    throw new Error();
};
export function Fetch(request: FetchRequest) {
    return fetch(request);
}

let fetchHTML = function(_request: FetchRequest): Promise<Document> {
    throw new Error();
};
export function FetchHTML(request: FetchRequest): Promise<Document> {
    return fetchHTML(request);
}

let fetchJSON = function<TResult>(_request: FetchRequest): Promise<TResult> {
    throw new Error();
};
export function FetchJSON<TResult>(request: FetchRequest): Promise<TResult> {
    return fetchJSON<TResult>(request);
}

let fetchCSS = function<T extends HTMLElement>(_request: FetchRequest, _query: string): Promise<T[]> {
    throw new Error();
};
export function FetchCSS<T extends HTMLElement>(request: FetchRequest, query: string): Promise<T[]> {
    return fetchCSS<T>(request, query);
}

let fetchWindowCSS = function<T extends HTMLElement>(_request: FetchRequest, _query: string, _delay = 0, _timeout?: number): Promise<T[]> {
    throw new Error();
};
export function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout?: number): Promise<T[]> {
    return fetchWindowCSS(request, query, delay, timeout);
}

let fetchWindowScript = function<T>(_request: FetchRequest, _script: string, _delay = 0, _timeout?: number): Promise<T> {
    throw new Error();
};
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