export default class Headers {
    constructor(headers) {
        this._headers = headers;
    }
    get Values() {
        // TODO: return clone (field should be immutable)
        return this._headers;
    }
    GetHeader(name) {
        return this._headers.find(header => header.name.toLowerCase() === name.toLowerCase());
    }
    SetHeader(name, value) {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if (index > -1) {
            this._headers[index].value = value;
        }
        else {
            this._headers.push({ name, value });
        }
    }
    DeleteHeader(name) {
        let index = this._headers.findIndex(header => header.name.toLowerCase() === name.toLowerCase());
        if (index > -1) {
            // splice(...)
        }
    }
}
//# sourceMappingURL=Headers.js.map