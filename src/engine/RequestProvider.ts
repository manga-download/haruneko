import { HeaderEditor, ConcealHeaders, RevealHeaders } from './transformers/HeaderEditor';

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
        chrome.webRequest.onBeforeSendHeaders.addListener(
            this.ConfigureHeaders,
            {
                urls: [
                    '<all_urls>',
                    '*://www.evil.com/*'
                ]
            },
            [
                'blocking' /* sync request required for header modification */,
                'requestHeaders',
                'extraHeaders' /* allow change referer, origin, cookie */
            ]);
    }

    private ConfigureHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
        const headers = new HeaderEditor(details.requestHeaders || []);
        RevealHeaders(headers);
        headers.AddHeader('User-Agent', 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)', true);
        headers.AddHeader('Referer', details.url, true);
        //headers.SetHeader('Origin', 'hakuneko.download');
        //headers.SetHeader('Cookie', 'adult=1');

        return {
            requestHeaders: details.requestHeaders // headers.Values
        };
    }

    public async Fetch(request: Request): Promise<Response> {
        ConcealHeaders(request.headers);
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