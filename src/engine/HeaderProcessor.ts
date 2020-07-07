export interface IHeaderProcessor {
    GetHeaders(): chrome.webRequest.HttpHeader[];
    GetHeader(name: string): chrome.webRequest.HttpHeader;
    SetHeader(name: string, value: string): void;
    DeleteHeader(name: string): void;
    ReplaceHeaderName(nameOld: string, nameNew: string): void;
}

export class HeaderProcessor implements IHeaderProcessor {

    private readonly _headers: chrome.webRequest.HttpHeader[];

    constructor(headers: chrome.webRequest.HttpHeader[]) {
        this._headers = headers.map(header => {
            return {
                name: header.name.toLowerCase(),
                value: header.value
            };
        });
    }

    public GetHeaders(): chrome.webRequest.HttpHeader[] {
        return this._headers;
    }

    public ContainsHeader(name: string): boolean {
        return this._headers.some(header => header.name === name.toLowerCase());
    }

    public GetHeader(name: string): chrome.webRequest.HttpHeader {
        return this._headers.find(header => header.name === name.toLowerCase()) || null;
    }

    public SetHeader(name: string, value: string): void {
        let index = this._headers.findIndex(header => header.name === name.toLowerCase());
        if(index > -1) {
            this._headers[index].value = value;
        } else {
            this._headers.push({ name: name.toLowerCase(), value: value });
        }
    }

    public DeleteHeader(name: string): void {
        let index = this._headers.findIndex(header => header.name === name.toLowerCase());
        if(index > -1) {
            this._headers.splice(index, 1)
        }
    }

    public ReplaceHeaderName(nameOld: string, nameNew: string): void {
        if(nameOld.toLowerCase() === nameNew.toLowerCase()) {
            return;
        }
        if(this.ContainsHeader(nameNew)) {
            throw new Error(`Failed to rename header, a header with the name '${nameNew}' already exist!`);
        }
        let header = this.GetHeader(nameOld);
        if(!header) {
            // TODO: To throw or not to throw?
            throw new Error(`Failed to rename header, a header with the name '${nameOld}' does not exist!`);
        } else {
            header.name = nameNew.toLowerCase();
        }
    }
}