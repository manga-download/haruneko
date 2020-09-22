import { Blacklist } from './Blacklist';
import { HeadersView } from './transformers/HeadersView';

const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiUnsupportedHeaders = [
    'User-Agent',
    'Referer',
    'Origin',
    'Host'
];

export interface IExploitedRequest {
    new (input: RequestInfo, init?: RequestInit | undefined): Request;
    //prototype: Request;
}

export class ExploitedRequest extends Request {

    constructor(input: RequestInfo, init?: RequestInit | undefined) {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        if(init && init.headers) {
            const headers = new Headers(init.headers);
            ExploitedRequest.ConcealFetchAPIHeaders(headers);
            init.headers = headers;
        }
        super(input, init);
    }

    public static ConcealFetchAPIHeaders(headers: Headers): void {
        for(const header of fetchApiUnsupportedHeaders) {
            const prefixed = fetchApiSupportedPrefix + header;
            const value = headers.get(header);
            if(value !== null) {
                headers.set(prefixed, value);
                headers.delete(header);
            }
        }
    }

    public static RevealFetchAPIHeaders(headers: HeadersView): void {
        for(const header of fetchApiUnsupportedHeaders) {
            const prefixed = fetchApiSupportedPrefix + header;
            const value = headers.get(prefixed);
            if(value !== null) {
                headers.set(header, value);
                headers.delete(prefixed);
            }
        }
    }
}

export interface IRequestProvider {
    Fetch(request: Request): Promise<Response>;
    //FetchDOM: () => Promise<any>;
    //FetchText: () => Promise<any>;
    FetchJSON<TResult>(request: Request): Promise<TResult>;
    //FetchRegex: () => Promise<any>;
    //FetchBrowser: () => Promise<any>;
    //FetchDebugger: () => Promise<any>;
}

export class RequestProvider implements IRequestProvider {

    constructor() {
        // NOTE: parameter extraInfoSpec:
        //       'blocking'       => sync request required for header modification
        //       'requestHeaders' => allow change request headers?
        //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
        chrome.webRequest.onBeforeSendHeaders.addListener(this.BlockRequests, { urls: Blacklist }, [ 'blocking' ]);
        chrome.webRequest.onBeforeSendHeaders.addListener(this.ModifyFetchHeaders, { urls: [ /*'<all_urls>'*/ window.location.origin ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
    }

    private BlockRequests() {
        return {
            cancel: true
        };
    }

    private ModifyFetchHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
        // TODO: set cookies from chrome matching the details.url?
        //const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));
        const headers = new HeadersView(details.requestHeaders || []);
        headers.set('Referer', details.url);
        ExploitedRequest.RevealFetchAPIHeaders(headers);

        return {
            requestHeaders: details.requestHeaders // headers.Values
        };
    }

    public async Fetch(request: Request): Promise<Response> {
        return fetch(request);
    }

    private async FetchHTML(request: Request, replaceImageTags = true, clearIframettributes = true): Promise<HTMLHtmlElement> {
        const response = await this.Fetch(request);
        let content = await response.text();
        if(replaceImageTags) {
            content = content.replace(/<img/g, '<source');
            content = content.replace(/<\/img/g, '</source');
            content = content.replace(/<use/g, '<source');
            content = content.replace(/<\/use/g, '</source');
        }
        if(clearIframettributes) {
            content = content.replace(/<iframe[^<]*?>/g, '<iframe>');
        }
        let dom = document.createElement('html');
        dom.innerHTML = content;
        return dom;
    }

    public async FetchJSON<TResult>(request: Request): Promise<TResult> {
        const response = await this.Fetch(request);
        return response.json();
    }

    public async FetchCSS(request: Request, query: string): Promise<Element[]> {
        const dom = await this.FetchHTML(request);
        return [...dom.querySelectorAll(query)];
    }

    public async FetchXPATH(request: Request, xpath: string): Promise<Node[]> {
        const dom = await this.FetchHTML(request);
        const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
    }
}