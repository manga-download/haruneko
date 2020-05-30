import { HeaderProcessor } from './HeaderProcessor';

const fetchApiSupportedPrefix = 'x-';
const fetchApiUnsupportedHeaders = [
    'referer',
    'origin',
    'host'
];

function ConcealHeaders(headers: Headers) {
    for(let key in headers.keys()) {
        if(fetchApiUnsupportedHeaders.includes(key.toLowerCase())) {
            let value = headers.get(key);
            headers.set('x-' + key, value);
            headers.delete(key);
        }
    }
}

function RevealHeaders(headers: chrome.webRequest.HttpHeader[]) {
    let value = headers.get('x-referer');
    if(value) {
        headers.set('referer', value);
        headers.delete('x-referer');
    }
}

export interface IRequestProvider {
    fetch(request: Request): Promise<Response>;
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
        // go through each header
        // check if a replace entry exists for the header
        // check if a replace entry exists for the URL (regex match?)
        // replace header
        let dbg = details.requestHeaders[0];
        dbg.name;
        dbg.value;
        //let headers = new Headers(details.requestHeaders);
        //headers.SetHeader('User-Agent', 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)');
        //headers.SetHeader('Referer', 'https://hakuneko.download');
        //headers.SetHeader('Origin', 'hakuneko.download');
        //headers.SetHeader('Cookie', 'adult=1');

        if(/^https?:\/\/postman-echo.com/.test(details.url)) {
            headers.SetHeader('X-HakuNeko-URL', 'URL Match');
        }

        let map = [
            {
                header: 'referer',
                replacement: 'x-referer'
            }
        ];

        /*
        for(let header of map) {
            headers.ReplaceHeaderName('X-HakuNeko-Header', 'Header Match');
        }
        */

        return {
            requestHeaders: headers.Values
        };
    }

    public async fetch(request: Request) {
        return fetch(request);
    }

    public async FetchJSON<TResult>(request: Request): Promise<TResult> {
        ConcealHeaders(request.headers);
        let response = await fetch(request);
        return response.json();
    }
}