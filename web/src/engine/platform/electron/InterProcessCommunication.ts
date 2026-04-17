import type { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';

type CookieSet = { name: string; value: string }[];

class IPC {

    On(channel: Channels.RemoteBrowserWindowController.OnDomReady, callback: (windowID: number) => Promise<void>): void;
    On(channel: Channels.RemoteBrowserWindowController.OnBeforeNavigate, callback: (windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean) => Promise<void>): void;
    On(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;

    /**
     * Register a {@link callback} to handle a message from the _Main_ process via `webContents.send(channel, ...args)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: (...parameters: TParameters) => void): void {
        globalThis.ipcRenderer.on(channel, (_, ...args: TParameters) => callback(...args));
    }

    Send(channel: never, ...parameters: never): never;

    /**
     * Send a message to the _Main_ process handled by `ipcMain.on(channel, listener)`.
     * The sender does not receive a response (fire & forget).
     */
    public Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): void {
        globalThis.ipcRenderer.send(channel, ...parameters);
    }

    Handle(channel: never, ...parameters: never): never;

    /**
     * Register a {@link callback} to handle a request from the _MAin_ process via `ipcMain.invoke(channel, ...args)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(_channel: string, _callback: (...parameters: TParameters) => TReturn | PromiseLike<TReturn>): void {
        throw new Error('Not natively supported by Electron!');
    }

    // ApplicationWindow
    Invoke(channel: Channels.ApplicationWindow.ShowWindow): void;
    Invoke(channel: Channels.ApplicationWindow.HideWindow): void;
    Invoke(channel: Channels.ApplicationWindow.Minimize): void;
    Invoke(channel: Channels.ApplicationWindow.Maximize): void;
    Invoke(channel: Channels.ApplicationWindow.Restore): void;
    Invoke(channel: Channels.ApplicationWindow.Close): void;
    Invoke(channel: Channels.ApplicationWindow.OpenSplash, url: string): void;
    Invoke(channel: Channels.ApplicationWindow.CloseSplash): void;
    // BloatGuard
    Invoke(channel: Channels.BloatGuard.Initialize, patterns: string[]): Promise<void>;
    // FetchProvider
    Invoke(channel: Channels.FetchProvider.Initialize, fetchApiSupportedPrefix: string): Promise<void>;
    Invoke(channel: Channels.FetchProvider.GetSessionCookies, filter: Electron.CookiesGetFilter): Promise<CookieSet>;
    // RemoteBrowserWindowController
    Invoke(channel: Channels.RemoteBrowserWindowController.OpenWindow, options: string): Promise<number>;
    Invoke(channel: Channels.RemoteBrowserWindowController.CloseWindow, windowID: number): Promise<void>
    Invoke(channel: Channels.RemoteBrowserWindowController.SetVisibility, windowID: number, show: boolean): Promise<void>;
    Invoke<T extends void | JSONElement>(channel: Channels.RemoteBrowserWindowController.ExecuteScript, windowID: number, script: string): Promise<T>;
    Invoke<T extends void | JSONElement>(channel: Channels.RemoteBrowserWindowController.SendDebugCommand, windowID: number, method: string, parameters?: JSONObject): Promise<T>
    Invoke(channel: Channels.RemoteBrowserWindowController.LoadURL, windowID: number, url: string, options: string): Promise<void>;
    // RemoteProcedureCallManager
    Invoke(channel: Channels.RemoteProcedureCallManager.Stop): Promise<void>;
    Invoke(channel: Channels.RemoteProcedureCallManager.Restart, port: number, secret: string): Promise<void>;

    /**
     * Send a request to the _Main_ process handled by `ipcMain.handle(channel, listener)`.
     * The sender receives a response with the result from the handler.
     */
    public Invoke<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, ...parameters: TParameters): TReturn | PromiseLike<TReturn> {
        return globalThis.ipcRenderer.invoke(channel, ...parameters);
    }
}

let instance: IPC;

export function GetIPC() {
    if (!instance) {
        instance = new IPC();
    }
    return instance;
}