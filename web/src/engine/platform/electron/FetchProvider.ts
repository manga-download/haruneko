//import { Exception } from '../../Error';
//import { EngineResourceKey as R } from '../../../i18n/ILocale';
import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
//import { FetchRedirection } from '../AntiScrapingDetection';
//import { CheckAntiScrapingDetection } from './AntiScrapingDetection';
import { FetchProvider, type ScriptInjection } from '../FetchProviderCommon';

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

export default class extends FetchProvider {

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