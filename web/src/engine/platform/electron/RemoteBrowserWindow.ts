import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron';
import { Observable, type IObservable } from '../../Observable';
import type { IRemoteBrowserWindow } from '../RemoteBrowserWindow';
import type { ScriptInjection } from '../FetchProviderCommon';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

export default class RemoteBrowserWindow implements IRemoteBrowserWindow {

    private windowID = Number.NaN;

    private readonly ipc = GetIPC();

    private readonly domReady = new Observable<void, RemoteBrowserWindow>(null, this);
    public get DOMReady(): IObservable<void, RemoteBrowserWindow> {
        return this.domReady;
    };

    private readonly beforeWindowNavigate = new Observable<URL, RemoteBrowserWindow>(null, this);
    public get BeforeWindowNavigate(): IObservable<URL, RemoteBrowserWindow> {
        return this.beforeWindowNavigate;
    };

    private readonly beforeFrameNavigate = new Observable<URL, RemoteBrowserWindow>(null, this);
    public get BeforeFrameNavigate(): IObservable<URL, RemoteBrowserWindow> {
        return this.beforeFrameNavigate;
    };

    constructor () {
        this.ipc.Listen(Channels.RemoteBrowserWindowController.OnDomReady, this.OnDomReady.bind(this));
        this.ipc.Listen(Channels.RemoteBrowserWindowController.OnBeforeNavigate, this.OnBeforeNavigate.bind(this));
    }

    private async OnDomReady(windowID: number): Promise<void> {
        if(windowID === this.windowID) {
            this.domReady.Dispatch();
        }
    }

    private async OnBeforeNavigate(windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean): Promise<void> {
        if(windowID === this.windowID && url.startsWith('http') && !isSameDocument) {
            if(isMainFrame) {
                this.beforeWindowNavigate.Value = new URL(url);
            } else {
                this.beforeFrameNavigate.Value = new URL(url);
            }
        }
    }

    public async Open(request: Request, show: boolean = false, preload: ScriptInjection<void> = '') {

        const openOptions: BrowserWindowConstructorOptions = {
            show: show,
            width: 1280,
            height: 800,
            center: true,
            webPreferences: {
                sandbox: true,
                webSecurity: true,
                contextIsolation: false, // Disabled for sharing `window` instance in pre-load script: https://www.electronjs.org/docs/latest/tutorial/context-isolation#what-is-it
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nodeIntegrationInSubFrames: true, // Enabled to execute pre-load script in all sub-frames: https://github.com/electron/electron/issues/22582
                disableBlinkFeatures: 'AutomationControlled',
                preload: preload instanceof Function ? `(${preload})()` : preload,
            }
        };

        this.windowID = await this.ipc.Send<number>(Channels.RemoteBrowserWindowController.OpenWindow, JSON.stringify(openOptions));

        /*
        if(isNaN(this.windowID)) {
            throw new Error('[I18N] - Failed to open Browser Window!');
        }
        */

        const loadOptions: LoadURLOptions = {
            userAgent: request.headers.get('User-Agent') ?? navigator.userAgent,
            httpReferrer: request.headers.get('Referer') ?? request.referrer ?? request.url,
        };

        await this.ipc.Send<void>(Channels.RemoteBrowserWindowController.LoadURL, this.windowID, request.url, JSON.stringify(loadOptions));
    }

    public async Close(): Promise<void> {
        if(!isNaN(this.windowID)) {
            return this.ipc.Send<void>(Channels.RemoteBrowserWindowController.CloseWindow, this.windowID);
        }
    }

    public async Show(): Promise<void> {
        return this.ipc.Send<void>(Channels.RemoteBrowserWindowController.SetVisibility, this.windowID, true);
    }

    public async Hide(): Promise<void> {
        return this.ipc.Send<void>(Channels.RemoteBrowserWindowController.SetVisibility, this.windowID, false);
    }

    public async ExecuteScript<T extends void | JSONElement>(script: ScriptInjection<T> = ''): Promise<T> {
        return this.ipc.Send<T>(Channels.RemoteBrowserWindowController.ExecuteScript, this.windowID, script instanceof Function ? `(${script})()` : script);
    }

    public async SendDebugCommand<T extends void | JSONElement>(method: string, parameters?: JSONObject): Promise<T> {
        return this.ipc.Send<T>(Channels.RemoteBrowserWindowController.SendDebugCommand, this.windowID, method, parameters);
    }
}