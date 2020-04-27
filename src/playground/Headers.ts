interface IHeaders {
    GetHeader: (name: string) => chrome.webRequest.HttpHeader;
    SetHeader: (name: string, value: string) => void;
    DeleteHeader: (name: string) => void;
    Values: chrome.webRequest.HttpHeader[];
}

export default class Headers implements IHeaders {

    private readonly _headers: chrome.webRequest.HttpHeader[];

    constructor(headers: chrome.webRequest.HttpHeader[]) {
        this._headers = headers;
    }

    public get Values() {
        // TODO: return clone (field should be immutable)
        return this._headers;
    }

    public GetHeader(name: string): chrome.webRequest.HttpHeader {
        return this._headers.find(header => header.name.toLowerCase() === name.toLowerCase());
    }

    public SetHeader(name: string, value: string) {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if(index > -1) {
            this._headers[index].value = value;
        } else {
            this._headers.push({ name, value });
        }
    }

    public DeleteHeader(name: string) {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if(index > -1) {
            // splice(...)
        }
    }
}