import { ipcMain } from 'electron';
import type { Channels } from './InterProcessCommunicationChannels';

export class IPC {

    constructor(private readonly webContents: Electron.WebContents) { }

    On(channel: never, callback: never): never;

    /**
     * Register a {@link callback} to handle a message from the _Render_ process via `ipcRenderer.send(channel, ...args)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: (...parameters: TParameters) => void): void {
        ipcMain.on(channel, (_, ...args: TParameters) => callback(...args));
    }

    Send(channel: Channels.RemoteBrowserWindowController.OnDomReady, windowID: number): void;
    Send(channel: Channels.RemoteBrowserWindowController.OnBeforeNavigate, windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean): void;
    Send(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, url: string): void;

    /**
     * Send a message to the _Render_ process handled by `ipcRenderer.on(channel, listener)`.
     * The sender does not receive a response (fire & forget).
     */
    public Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): void {
        this.webContents.send(channel, ...parameters);
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
    Handle(channel: Channels.FetchProvider.Initialize, callback: (fetchApiSupportedPrefix: string) => void): void;
    Handle(channel: Channels.FetchProvider.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;
    // RemoteBrowserWindowController
    Handle(channel: Channels.RemoteBrowserWindowController.OpenWindow, callback: (options: string) => Promise<number>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.CloseWindow, callback: (windowID: number) => Promise<void>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.SetVisibility, callback: (windowID: number, show: boolean) => Promise<void>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.ExecuteScript, callback: <T extends JSONElement>(windowID: number, script: string) => Promise<T>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.SendDebugCommand, callback: <T extends void | JSONElement>(windowID: number, channel: string, parameters?: JSONObject) => Promise<T>): void;
    Handle(channel: Channels.RemoteBrowserWindowController.LoadURL, callback: (windowID: number, url: string, options: string) => Promise<void>): void;
    // RemoteProcedureCallManager
    Handle(channel: Channels.RemoteProcedureCallManager.Stop, callback: () => Promise<void>): void;
    Handle(channel: Channels.RemoteProcedureCallManager.Restart, callback: (port: number, secret: string) => Promise<void>): void;

    /**
     * Register a {@link callback} to handle a request from the _Render_ process via `ipcRenderer.invoke(channel, ...args)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, callback: (...parameters: TParameters) => TReturn | PromiseLike<TReturn>): void {
        ipcMain.handle(channel, (_, ...args: TParameters) => callback(...args));
    }

    Invoke(channel: never, ...parameters: never): never;

    /**
     * Send a request to the _Render_ process handled by `ipcRenderer.handle(channel, listener)`.
     * The sender receives a response with the result from the handler.
     */
    public Invoke<TParameters extends JSONArray, TReturn extends JSONElement>(_channel: string, ..._parameters: TParameters): TReturn | PromiseLike<TReturn> {
        throw new Error('Not natively supported by Electron!');
    }
}