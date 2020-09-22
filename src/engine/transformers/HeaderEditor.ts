const fetchApiSupportedPrefix = 'x-';
const fetchApiUnsupportedHeaders = [
    'User-Agent',
    'Referer',
    'Origin',
    'Cookie',
    'Host'
];

export function ConcealHeaders(headers: Headers): void {
    for(const header of fetchApiUnsupportedHeaders) {
        const value = headers.get(header);
        if(value !== null) {
            headers.delete(header);
            headers.append(fetchApiSupportedPrefix + header, value);
        }
    }
}

export function RevealHeaders(headers: HeaderEditor): void {
    for(const header of fetchApiUnsupportedHeaders) {
        // TODO: merge cookies, support multiple cookie headers ... ???
        //       => https://stackoverflow.com/questions/16305814/are-multiple-cookie-headers-allowed-in-an-http-request
        if(/x-cookie/i.test(header)) {
            throw new Error('Cookie header processing not implemented!');
        } else {
            headers.RenameHeaders(fetchApiSupportedPrefix + header, header);
        }
    }
}

export class HeaderEditor {

    private readonly _headers: chrome.webRequest.HttpHeader[];

    constructor(headers: chrome.webRequest.HttpHeader[]) {
        this._headers = headers;
    }

    private GetHeaders(name: string): chrome.webRequest.HttpHeader[] {
        const key = name.toLowerCase();
        return this._headers.filter(header => header.name.toLowerCase() === key);
    }

    public AddHeader(name: string, value: string, skipWhenExist = true): void {
        if(!skipWhenExist || this.GetHeaders(name).length === 0) {
            this._headers.push({
                name: name,
                value: value
            });
        }
    }

    public SetHeaders(name: string, value: string): void {
        const headers = this.GetHeaders(name);
        if(!headers.length) {
            this._headers.push({
                name: name,
                value: value
            });
        } else {
            for(const header of headers) {
                header.value = value;
            }
        }
    }

    public RenameHeaders(nameOld: string, nameNew: string): void {
        for(const header of this.GetHeaders(nameOld)) {
            // TODO: what if `header` already exist, renaming `x-header` to `header` would lead to duplicates ... ???
            header.name = nameNew;
        }
    }
}