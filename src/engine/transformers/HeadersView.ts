export class HeadersView {

    private readonly _headers: chrome.webRequest.HttpHeader[];

    constructor(headers: chrome.webRequest.HttpHeader[]) {
        this._headers = headers;
    }

    private findIndex(name: string): number {
        const key = name.toLowerCase();
        return this._headers.findIndex(header => header.name.toLowerCase() === key);
    }

    private find(name: string): chrome.webRequest.HttpHeader | null {
        const index = this.findIndex(name);
        return index > -1 ? this._headers[index] : null;
    }

    public has(name: string): boolean {
        return this.findIndex(name) > -1;
    }

    public get(name: string): string | null {
        const header = this.find(name);
        if(header && header.value) {
            return header.value;
        } else {
            return null;
        }
    }

    public set(name: string, value: string | null): void {
        const header = this.find(name);
        if(header) {
            header.value = value || undefined;
        } else {
            this._headers.push({ name, value: value || undefined });
        }
    }

    public delete(name: string): void {
        const index = this.findIndex(name);
        if(index > -1) {
            this._headers.splice(index, 1);
        }
    }
}