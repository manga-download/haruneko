import { Blacklist } from './Blacklist';
import { HeadersView } from './transformers/HeadersView';

const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiUnsupportedHeaders = [
    'User-Agent',
    'Referer',
    'Origin',
    'Host'
];

/*
export interface IFetchRequest extends Request {
new (input: RequestInfo, init?: RequestInit): FetchRequest;
}
*/

export class FetchRequest extends Request {

    public constructor(input: RequestInfo, init?: RequestInit) {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        if(init && init.headers) {
            const headers = new Headers(init.headers);
            FetchRequest.ConcealFetchAPIHeaders(headers);
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

// NOTE: parameter extraInfoSpec:
//       'blocking'       => sync request required for header modification
//       'requestHeaders' => allow change request headers?
//       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
chrome.webRequest.onBeforeSendHeaders.addListener(BlockRequests, { urls: Blacklist }, [ 'blocking' ]);
chrome.webRequest.onBeforeSendHeaders.addListener(ModifyFetchHeaders, { urls: [ '<all_urls>' /*window.location.origin*/ ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);

function BlockRequests() {
    return {
        cancel: true
    };
}

function ModifyFetchHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
    // TODO: set cookies from chrome matching the details.url?
    //const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));
    const headers = new HeadersView(details.requestHeaders || []);
    headers.set('Referer', details.url);
    FetchRequest.RevealFetchAPIHeaders(headers);

    return {
        requestHeaders: details.requestHeaders // headers.Values
    };
}

export async function Fetch(request: FetchRequest): Promise<Response> {
    return fetch(request);
}

async function FetchHTML(request: FetchRequest): Promise<Document> {
    const response = await Fetch(request);
    const content = await response.text();
    const mime = 'text/html'; // response.headers.get('content-type')
    return new DOMParser().parseFromString(content, mime);
}

export async function FetchJSON<TResult>(request: FetchRequest): Promise<TResult> {
    const response = await Fetch(request);
    return response.json();
}

export async function FetchCSS<T extends HTMLElement>(request: FetchRequest, query: string): Promise<T[]> {
    const dom = await FetchHTML(request);
    return [...dom.querySelectorAll(query)] as T[];
}

/*
public async FetchXPATH(request: FetchRequest, xpath: string): Promise<Node[]> {
    const dom = await this.FetchHTML(request);
    const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
}
*/