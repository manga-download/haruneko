import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
import { Observable, type IObservable } from '../../Observable';
import type { IPC } from '../InterProcessCommunication';
import type { ScriptInjection } from '../FetchProviderCommon';
import { RemoteBrowserWindowController as Channels } from '../../../../../app/src/ipc/Channels';

export default class RemoteBrowserWindow {

    private windowID = Number.NaN;

    private readonly domReady = new Observable<Document, RemoteBrowserWindow>(null, this);
    public get DOMReady(): IObservable<Document, RemoteBrowserWindow> {
        return this.domReady;
    };

    private readonly beforeNavigate = new Observable<URL, RemoteBrowserWindow>(null, this);
    public get BeforeNavigate(): IObservable<URL, RemoteBrowserWindow> {
        return this.beforeNavigate;
    };

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>) {
        this.ipc.Listen(Channels.Web.OnDomReady, this.OnDomReady.bind(this));
        this.ipc.Listen(Channels.Web.OnBeforeNavigate, this.OnBeforeNavigate.bind(this));
    }

    private async OnDomReady(windowID: number): Promise<void> {
        if(windowID === this.windowID) {
            const html = await this.ExecuteScript<string>(`document.querySelector('html').innerHTML`);
            this.domReady.Value = new DOMParser().parseFromString(html, 'text/html');
        }
    }

    private async OnBeforeNavigate(windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean): Promise<void> {
        if(windowID === this.windowID && url.startsWith('http') && !isSameDocument) {
            this.beforeNavigate.Value = new URL(url);
        }
    }

    public async Open(request: Request, show: boolean = false, preload: ScriptInjection<void> = '') {
        const openOptions: BrowserWindowConstructorOptions = {
            show: show,
            width: 1280,
            height: 720,
            webPreferences: {
                preload: preload instanceof Function ? `(${preload})()` : preload,
                webSecurity: true,
                contextIsolation: true,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nodeIntegrationInSubFrames: false,
                disableBlinkFeatures: 'AutomationControlled',
            }
        };

        this.windowID = await this.ipc.Send(Channels.App.OpenWindow, JSON.stringify(openOptions)) as number;

        /*
        if(isNaN(this.windowID)) {
            throw new Error('[I18N] - Failed to open Browser Window!');
        }
        */

        const loadOptions: LoadURLOptions = {
            userAgent: request.headers.get('User-Agent') ?? navigator.userAgent,
            httpReferrer: request.headers.get('Referer') ?? request.referrer ?? request.url,
        };

        await this.ipc.Send(Channels.App.LoadURL, this.windowID, request.url, JSON.stringify(loadOptions));
    }

    public async Close(): Promise<void> {
        if(!isNaN(this.windowID)) {
            return this.ipc.Send(Channels.App.CloseWindow, this.windowID);
        }
    }

    public async Show(): Promise<void> {
        return this.ipc.Send(Channels.App.SetVisibility, this.windowID, true);
    }

    public async Hide(): Promise<void> {
        return this.ipc.Send(Channels.App.SetVisibility, this.windowID, false);
    }

    public async ExecuteScript<T extends void | JSONElement>(script: ScriptInjection<T> = ''): Promise<T> {
        return this.ipc.Send(Channels.App.ExecuteScript, this.windowID, script instanceof Function ? `(${script})()` : script);
    }
}