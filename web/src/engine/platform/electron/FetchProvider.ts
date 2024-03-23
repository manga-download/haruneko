import protobuf from 'protobufjs';
import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
import { EngineResourceKey as R } from '../../../i18n/ILocale';
import type { IFetchProvider, ScriptInjection } from '../FetchProvider';
import type { JSONObject } from '../../../../../node_modules/websocket-rpc/dist/types';
import { Exception, InternalError } from '../../Error';

// See: https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiForbiddenHeaders = [
    'User-Agent',
    'Referer',
    'Cookie',
    'Origin',
    'Host',
    'Sec-Fetch-Dest'
];

function ConcealHeaders(init: HeadersInit): Headers {
    const headers = new Headers(init);
    for(const name of fetchApiForbiddenHeaders) {
        if(headers.has(name)) {
            headers.set(fetchApiSupportedPrefix + name, headers.get(name));
            headers.delete(name);
        }
    }
    return headers;
}

class FetchRequest extends Request {
    constructor(input: URL | RequestInfo, init?: RequestInit) {
        if(init?.headers) {
            init.headers = ConcealHeaders(init.headers);
        }
        super(input, init);
    }
}

export default class implements IFetchProvider {

    public get IsVerboseModeEnabled() {
        return window.localStorage.getItem('hakuneko-fetchwindow-verbose') === 'true';
    }

    public set IsVerboseModeEnabled(value: boolean) {
        window.localStorage.setItem('hakuneko-fetchwindow-verbose', value.toString());
    }

    private async Wait(delay: number) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    Initialize(): void {

        // Abuse the global Request type to check if system is already initialized
        if(globalThis.Request === FetchRequest) {
            return;
        }

        // NOTE: Monkey patching of the browser's native functionality to allow forbidden headers
        globalThis.Request = FetchRequest;

        globalThis.ipcRenderer.invoke('FetchProvider::Initialize', fetchApiSupportedPrefix);
    }

    Fetch(request: Request): Promise<Response> {
        console.log('Platform::Electron::FetchProvider::Fetch()', '=>', request);
        return fetch(request);
    }

    public async FetchHTML(request: Request): Promise<Document> {
        const mime = 'text/html';
        const charsetPattern = /charset=([\w-]+)/;

        const response = await this.Fetch(request);
        const data = await response.arrayBuffer();
        const dom = new DOMParser().parseFromString(new TextDecoder().decode(data), mime);

        const charset = dom.head?.querySelector<HTMLMetaElement>('meta[charset]')?.getAttribute('charset')
            ?? dom.head?.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Type"]')?.content?.match(charsetPattern)?.at(1)
            ?? response.headers?.get('Content-Type')?.match(charsetPattern)?.at(1)
            ?? 'UTF-8';

        return /UTF-?8/i.test(charset) ? dom : new DOMParser().parseFromString(new TextDecoder(charset).decode(data), mime);
    }

    public async FetchJSON<TResult>(request: Request): Promise<TResult> {
        const response = await this.Fetch(request);
        return response.json();
    }

    public async FetchCSS<T extends HTMLElement>(request: Request, query: string): Promise<T[]> {
        const dom = await this.FetchHTML(request);
        return [...dom.querySelectorAll(query)] as T[];
    }

    public async FetchGraphQL<TResult>(request: Request, operationName: string, query: string, variables: JSONObject): Promise<TResult> {

        const graphQLRequest = new Request(request.url, {
            body: JSON.stringify({ operationName, query, variables }),
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': '*/*'
            },
        });

        //copy custom headers from parent request
        for (const header of request.headers) {
            graphQLRequest.headers.set(header[0], header[1]);
        }

        type GraphQLResult = {
            errors: {
                code: number;
                message: string;
            }[];
            data: TResult;
        };

        const data = await this.FetchJSON<GraphQLResult>(graphQLRequest);
        if (data.errors && data.errors.length > 0) {
            throw new Exception(R.FetchProvider_FetchGraphQL_AggregateError, data.errors.map(error => error.message).join('\n'));
        }
        if (!data.data) {
            throw new Exception(R.FetchProvider_FetchGraphQL_MissingDataError);
        }
        return data.data;
    }

    public async FetchRegex(request: Request, regex: RegExp): Promise<string[]> {
        if (regex.flags.indexOf('g') == -1) {
            throw new InternalError(`The provided RegExp must contain the global 'g' modifier!`);
        }
        const response = await fetch(request);
        const data = await response.text();
        const result : string[] = [];
        let match = undefined;
        // eslint-disable-next-line no-cond-assign
        while (match = regex.exec(data)) {
            result.push(match[1]);
        }
        return result;
    }

    public async FetchProto<TResult>(request: Request, schema: string, messageTypePath: string) : Promise<TResult> {
        const response = await fetch(request);
        const serialized = new Uint8Array(await response.arrayBuffer());
        const prototype = protobuf.parse(schema, { keepCase: true }).root.lookupType(messageTypePath);
        return prototype.decode(serialized).toJSON() as TResult;
    }

    public async FetchWindowCSS<T extends HTMLElement>(request: Request, query: string, delay?: number, timeout?: number): Promise<T[]> {
        console.warn('Platform::Electron::FetchProvider::FetchWindowCSS()', '=>', request, query, delay, timeout);
        throw new Error('Method not implemented.');
    }

    public async FetchWindowScript<T>(request: Request, script: ScriptInjection<T>, delay?: number, timeout?: number): Promise<T> {
        console.warn('Platform::Electron::FetchProvider::FetchWindowScript()', '=>', request, script, delay, timeout);
        return this.FetchWindowPreloadScript<T>(request, () => undefined, script, delay, timeout);
    }

    public async FetchWindowPreloadScript<T>(request: Request, preload: ScriptInjection<void>, script: ScriptInjection<T>, delay: number = 0, timeout: number = 60_000): Promise<T> {
        console.warn('Platform::Electron::FetchProvider::FetchWindowPreloadScript()', '=>', request, preload, script, delay, timeout);

        const destroy = async (id: number) => {
            try {
                if(this.IsVerboseModeEnabled) {
                    //
                } else {
                    await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::CloseWindow', id);
                }
            } catch(error) {
                console.warn(error);
            }
        };

        const openOptions: BrowserWindowConstructorOptions = {
            show: this.IsVerboseModeEnabled,
            width: 1280,
            height: 720,
            webPreferences: {
                //preload: '',
                webSecurity: true,
                contextIsolation: true,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nodeIntegrationInSubFrames: false,
                disableBlinkFeatures: 'AutomationControlled',
            }
        };
        // 1. Open hidden window
        const windowID = await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::OpenWindow', JSON.stringify(openOptions)) as number;
        try {
            const loadOptions: LoadURLOptions = {
                userAgent: request.headers.get('User-Agent') ?? navigator.userAgent,
                httpReferrer: request.headers.get('Referer') ?? request.referrer ?? request.url,
            };
            await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::LoadURL', windowID, request.url, JSON.stringify(loadOptions));
            // 2. Check Anti-Scraping and show/redirect window
            if (!windowID) {
                await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::SetVisibility', windowID, true);
            }
            // 3. Wait for window to load expected location
            const result = await globalThis.ipcRenderer.invoke('RemoteBrowserWindowController::ExecuteScript', windowID, script instanceof Function ? `(${script})()` : script);
            return result;
        } finally {
            await destroy(windowID);
        }

        /*
        ipcMain.handle('RemoteBrowserWindowController::OpenWindow', (_, options: string) => this.OpenWindow(options));
        ipcMain.handle('RemoteBrowserWindowController::CloseWindow', (_, windowID: number) => this.CloseWindow(windowID));
        ipcMain.handle('RemoteBrowserWindowController::SetVisibility', (_, windowID: number, show: true) => this.SetVisibility(windowID, show));
        ipcMain.handle('RemoteBrowserWindowController::ExecuteScript', (_, windowID: number, script: string) => this.ExecuteScript(windowID, script));
        ipcMain.handle('RemoteBrowserWindowController::LoadURL', (_, windowID: number, url: string, options: string) => this.LoadURL(windowID, url, options));
        */
    }
}