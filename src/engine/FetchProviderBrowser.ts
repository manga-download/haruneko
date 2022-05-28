export function Initialize(): void {
    //
}

export class FetchRequest extends Request {

    public constructor(input: RequestInfo, init?: RequestInit) {
        super(input, init);
    }
}

export async function Fetch(request: FetchRequest): Promise<Response> {
    return fetch(request);
}

export async function FetchWindowCSS<T extends HTMLElement>(/*request: FetchRequest, query: string, delay = 0, timeout?: number*/): Promise<T[]> {
    /*
    const win = window.open(request.url);
    win.blur();
    window.focus();
    try {
        await Wait(delay || 1000);
        return [];
    } finally{
        win.close();
    }
    */
    return [];
}

export async function FetchWindowScript<T>(/*request: FetchRequest, script: string, delay = 0, timeout?: number*/): Promise<T> {
    /*
    const win = window.open(request.url);
    win.blur();
    window.focus();
    try {
        await Wait(delay || 1000);
        return null;
    } finally{
        win.close();
    }
    */
    return null;
}