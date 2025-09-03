import { ipcMain } from 'electron';

export namespace Channels {

    export const enum Reply {
        FromRender = 'Reply::FromRender',
    };

    /**
     * Supported IPC Channels for interacting with the main application window.
     */
    export const enum ApplicationWindow {
        ShowWindow = 'ApplicationWindow::ShowWindow',
        HideWindow = 'ApplicationWindow::HideWindow',
        Minimize = 'ApplicationWindow::Minimize',
        Maximize = 'ApplicationWindow::Maximize',
        Restore = 'ApplicationWindow::Restore',
        Close = 'ApplicationWindow::Close',
        OpenSplash = 'ApplicationWindow::OpenSplash',
        CloseSplash = 'ApplicationWindow::CloseSplash',
    };

    /**
     * ...
     */
    export const enum BloatGuard {
        Initialize = 'BloatGuard::Initialize',
    };

    /**
     * Supported IPC Channels for interacting with the fetch provider.
     */
    export const enum FetchProvider {
        OnBeforeSendHeaders = 'FetchProvider::OnBeforeSendHeaders',
        OnHeadersReceived = 'FetchProvider::OnHeadersReceived',
        Initialize = 'FetchProvider::Initialize',
        GetSessionCookies = 'FetchProvider::GetSessionCookies',
    };

    /**
     * Supported IPC Channels for interacting with browser windows.
     */
    export const enum RemoteBrowserWindowController {
        OnDomReady = 'RemoteBrowserWindowController::OnDomReady',
        OnBeforeNavigate = 'RemoteBrowserWindowController::OnBeforeNavigate',
        OpenWindow = 'RemoteBrowserWindowController::OpenWindow',
        CloseWindow = 'RemoteBrowserWindowController::CloseWindow',
        SetVisibility = 'RemoteBrowserWindowController::SetVisibility',
        ExecuteScript = 'RemoteBrowserWindowController::ExecuteScript',
        SendDebugCommand = 'RemoteBrowserWindowController::SendDebugCommand',
        LoadURL = 'RemoteBrowserWindowController::LoadURL',
    };

    /**
     * Supported IPC Channels for interacting with the RPC manager.
     */
    export const enum RemoteProcedureCallManager {
        Stop = 'RemoteProcedureCallManager::Stop',
        Restart = 'RemoteProcedureCallManager::Restart',
    };

    /**
     * Supported IPC Channels for interacting with the RPC contract callbacks.
     */
    export const enum RemoteProcedureCallContract {
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
    };
}

export class IPC {

    #replyResolvers = new Map<string, (value: void | JSONElement) => void>();

    constructor (private readonly webContents: Electron.WebContents) {
        this.On(Channels.Reply.FromRender, this.#ResolveReply.bind(this));
    }

    #ResolveReply(nonce: string, value: void | JSONElement): void {
        try {
            this.#replyResolvers.get(nonce)?.call(this, value);
        } finally {
            this.#replyResolvers.delete(nonce);
        }
    }

    /**
     * Handle a sent event from the Render process in the Main process
     * @description This handler is triggered by `ipcRender.send(...)`
     * @param channel - ...
     * @param callback - ...
     */
    public On<TParameters extends JSONArray>(channel: string, callback: (...parameters: TParameters) => void): void {
        //
        ipcMain.on(channel, (_, ...parameters: TParameters) => callback(...parameters));
    }

    Listen(channel: Channels.Reply.FromRender, callback: (nonce: string, result: JSONElement) => void): void;
    Listen(channel: Channels.ApplicationWindow.ShowWindow, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.HideWindow, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.Minimize, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.Maximize, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.Restore, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.Close, callback: () => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.OpenSplash, callback: (url: string) => Promise<void>): void;
    Listen(channel: Channels.ApplicationWindow.CloseSplash, callback: () => Promise<void>): void;
    Listen(channel: Channels.BloatGuard.Initialize, callback: (patterns: string[]) => Promise<void>): void;
    Listen(channel: Channels.FetchProvider.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    Listen(channel: Channels.FetchProvider.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.OpenWindow, callback: (options: string) => Promise<number>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.CloseWindow, callback: (windowID: number) => Promise<void>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.SetVisibility, callback: (windowID: number, show: boolean) => Promise<void>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.ExecuteScript, callback: <T extends JSONElement>(windowID: number, script: string) => Promise<T>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.SendDebugCommand, callback: <T extends void | JSONElement>(windowID: number, channel: string, parameters?: JSONObject) => Promise<T>): void;
    Listen(channel: Channels.RemoteBrowserWindowController.LoadURL, callback: (windowID: number, url: string, options: string) => Promise<void>): void;
    Listen(channel: Channels.RemoteProcedureCallManager.Stop, callback: () => Promise<void>): void;
    Listen(channel: Channels.RemoteProcedureCallManager.Restart, callback: (port: number, secret: string) => Promise<void>): void;

    /**
     * Handle an invocation from the Render process in the Main process and reply with a corresponding response
     * @description This handler is triggered by `ipcRender.invoke(...)`
     * @param channel ...
     * @param callback ...
     */
    public Listen<TParameters extends JSONArray, TReturn extends void | JSONElement>(channel: string, callback: (...parameters: TParameters) => PromiseLike<TReturn>): void {
        ipcMain.handle(channel, (_, ...parameters: TParameters) => callback(...parameters));
    }

    Send(channel: Channels.RemoteBrowserWindowController.OnDomReady, windowID: number): void;
    Send(channel: Channels.RemoteBrowserWindowController.OnBeforeNavigate, windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean): void;
    Send(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, url: string): void;

    /**
     * Send an event from the Main process to the Render process
     * @description This message will trigger `ipcRender.on(...)`
     * @param channel ...
     * @param parameters ...
     * @returns ...
     */
    public Send(channel: string, ...parameters: JSONArray): void {
        this.webContents.send(channel, ...parameters);
    }

    Invoke(channel: Channels.FetchProvider.OnBeforeSendHeaders, url: string, requestHeaders: Electron.OnBeforeSendHeadersListenerDetails[ 'requestHeaders' ]): Promise<Electron.BeforeSendResponse>;
    Invoke(channel: Channels.FetchProvider.OnHeadersReceived, url: string, responseHeaders: Electron.OnHeadersReceivedListenerDetails[ 'responseHeaders' ]): Promise<Electron.HeadersReceivedResponse>;

    /**
     * Invoke a method in the Render process from the Main process
     * @param channel ...
     * @param parameters ...
     * @returns ...
     */
    public Invoke<T extends JSONElement>(channel: string, ...parameters: JSONArray): Promise<T> {
        // TODO: Implement mechanism to receive a response ...
        const nonce = Date.now() + '' + Math.random();
        return new Promise<T>(resolve => {
            this.#replyResolvers.set(nonce, (value: T) => resolve(value));
            this.webContents.send(channel, nonce, ...parameters);
        });
    }
}