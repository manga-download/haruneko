import { ipcMain } from 'electron';

export namespace Channels {

    /**
     * Supported IPC Channels for interacting with the main application window.
     */
    export enum ApplicationWindow {
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
     * Supported IPC Channels for managing the blocked requests.
     */
    export enum BloatGuard {
        Initialize = 'BloatGuard::Initialize',
    };

    /**
     * Supported IPC Channels for interacting with the fetch provider.
     */
    export enum FetchProvider {
        //OnBeforeSendHeaders = 'FetchProvider::OnBeforeSendHeaders',
        //OnHeadersReceived = 'FetchProvider::OnHeadersReceived',
        Initialize = 'FetchProvider::Initialize',
        GetSessionCookies = 'FetchProvider::GetSessionCookies',
    };

    /**
     * Supported IPC Channels for creating and interacting with browser windows.
     */
    export enum RemoteBrowserWindowController {
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
     * Supported IPC Channels for managing the RPC service.
     */
    export enum RemoteProcedureCallManager {
        Stop = 'RemoteProcedureCallManager::Stop',
        Restart = 'RemoteProcedureCallManager::Restart',
    };

    /**
     * Supported IPC Channels for using the RPC service.
     */
    export enum RemoteProcedureCallContract {
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
    };
}

export class IPC {

    constructor (private readonly webContents: Electron.WebContents) { }

    //On(channel: Channels..., callback: (nonce: string, result: JSONElement) => void): void;

    /**
     * Handle an event received from the sender (e.g., Render process) without providing a response
     * @remarks This listener is triggered by `ipcRender.send(channel, ...args)`
     * @param channel - ...
     * @param callback - ...
     */
    public On<TParameters extends JSONArray>(channel: string, callback: (...parameters: TParameters) => void): void {
        //
        ipcMain.on(channel, (_, ...parameters: TParameters) => callback(...parameters));
    }

    // ApplicationWindow
    Handle(channel: Channels.ApplicationWindow.ShowWindow, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.HideWindow, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.Minimize, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.Maximize, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.Restore, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.Close, callback: () => void): void;
    Handle(channel: Channels.ApplicationWindow.OpenSplash, callback: (url: string) => void): void;
    Handle(channel: Channels.ApplicationWindow.CloseSplash, callback: () => void): void;
    // BloatGuard
    Handle(channel: Channels.BloatGuard.Initialize, callback: (patterns: string[]) => Promise<void>): void;
    // FetchProvider
    Handle(channel: Channels.FetchProvider.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    Handle(channel: Channels.FetchProvider.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;
    // RemoteBrowserWindowController
    Handle(channel: Channels.RemoteBrowserWindowController.OpenWindow, callback: (options: string) => Promise<number>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.CloseWindow, callback: (windowID: number) => Promise<void>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.SetVisibility, callback: (windowID: number, show: boolean) => Promise<void>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.ExecuteScript, callback: <T extends JSONElement>(windowID: number, script: string) => Promise<T>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.SendDebugCommand, callback: <T extends never | JSONElement>(windowID: number, channel: string, parameters?: JSONObject) => Promise<T>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.LoadURL, callback: (windowID: number, url: string, options: string) => Promise<void>): void;
    // RemoteProcedureCallManager
    Handle(channel: Channels.RemoteProcedureCallManager.Stop, callback: () => Promise<void>): void;
    Handle(channel: Channels.RemoteProcedureCallManager.Restart, callback: (port: number, secret: string) => Promise<void>): void;

    /**
     * Register a {@link callback} Handle an invocation from the sender (e.g., Render process) and reply with a corresponding response
     * @description This listener is triggered by `ipcRender.invoke(channel, ...args)`
     * @param channel ...
     * @param callback ...
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, callback: (...parameters: TParameters) => TReturn | PromiseLike<TReturn>): void {
        ipcMain.handle(channel, (_, ...parameters: TParameters) => callback(...parameters));
    }

    Send(channel: Channels.RemoteBrowserWindowController.OnDomReady, windowID: number): void;
    Send(channel: Channels.RemoteBrowserWindowController.OnBeforeNavigate, windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean): void;
    Send(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, url: string): void;

    /**
     * Send an event from the Main process to the Render process
     * @remarks This message will trigger `ipcRender.on(channel, ...args)`
     * @param channel ...
     * @param parameters ...
     * @returns ...
     */
    public Send(channel: string, ...parameters: JSONArray): void {
        this.webContents.send(channel, ...parameters);
    }

    //Invoke(channel: Channels.FetchProvider.OnBeforeSendHeaders, url: string, requestHeaders: Electron.OnBeforeSendHeadersListenerDetails[ 'requestHeaders' ]): Promise<Electron.BeforeSendResponse>;
    //Invoke(channel: Channels.FetchProvider.OnHeadersReceived, url: string, responseHeaders: Electron.OnHeadersReceivedListenerDetails[ 'responseHeaders' ]): Promise<Electron.HeadersReceivedResponse>;

    /**
     * Invoke a listener in the Render process from the Main process
     * @remarks This message will trigger the `ipcRender.handle(channel, ...args)`
     * @param channel ...
     * @param parameters ...
     * @returns ...
     */
    /*
    public Invoke<T extends JSONElement>(channel: string, ...parameters: JSONArray): Promise<T> {
        // TODO: Implement mechanism to receive a response ...
        const nonce = `${Date.now()}${Math.random()}`;
        return new Promise<T>(resolve => {
            this.#replyResolvers.set(nonce, (value: T) => resolve(value));
            this.webContents.send(channel, nonce, ...parameters);
        });
    }
    */
}