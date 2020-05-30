export interface IHeaderProcessor {
    GetHeader: (name: string) => chrome.webRequest.HttpHeader;
    SetHeader: (name: string, value: string) => void;
    DeleteHeader: (name: string) => void;
    ReplaceHeaderName: (nameOld: string, nameNew: string) => void;
    Values: chrome.webRequest.HttpHeader[];
}

export class HeaderProcessor implements IHeaderProcessor {

    private readonly _headers: chrome.webRequest.HttpHeader[];

    constructor(headers: chrome.webRequest.HttpHeader[]) {
        this._headers = headers;
    }

    public get Values(): chrome.webRequest.HttpHeader[] {
        // TODO: return clone (field should be immutable)
        return this._headers;
    }

    public ContainsHeader(name: string): boolean {
        return this._headers.some(header => header.name.toLowerCase() === name.toLowerCase());
    }

    public GetHeader(name: string): chrome.webRequest.HttpHeader {
        return this._headers.find(header => header.name.toLowerCase() === name.toLowerCase());
    }

    public SetHeader(name: string, value: string): void {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if(index > -1) {
            this._headers[index].value = value;
        } else {
            this._headers.push({ name, value });
        }
    }

    public DeleteHeader(name: string): void {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if(index > -1) {
            // splice(...)
        }
    }

    public ReplaceHeaderName(nameOld: string, nameNew: string): void {
        // find header by name (case insensitive)
        // get header original value
        // delete header
        // add header with new name and original value
    }
}