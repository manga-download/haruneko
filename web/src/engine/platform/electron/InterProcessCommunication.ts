import type { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

class IPC {

    //On(channel: Channels.FetchProvider.OnBeforeSendHeaders, callback: (url: string, requestHeaders: Electron.OnBeforeSendHeadersListenerDetails[ 'requestHeaders' ]) => Electron.BeforeSendResponse): void;
    //On(channel: Channels.FetchProvider.OnHeadersReceived, callback: (url: string, responseHeaders: Electron.OnHeadersReceivedListenerDetails[ 'responseHeaders' ]) => Electron.HeadersReceivedResponse): void;

    On(channel: Channels.RemoteBrowserWindowController.OnDomReady, callback: (windowID: number) => Promise<void>): void;
    On(channel: Channels.RemoteBrowserWindowController.OnBeforeNavigate, callback: (windowID: number, url: string, isMainFrame: boolean, isSameDocument: boolean) => Promise<void>): void;
    On(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;

    /**
     * Handle an event received from the Main process in the Render process
     * @remarks This listener is triggered by `ipcMAin.send(channel, ...args)`
     * @param channel - ...
     * @param callback - ...
     */
    public On<TParameters extends JSONArray>(channel: string, callback: (...parameters: TParameters) => void): void {
        // TODO: Implement mechanism to receive a response ...
        globalThis.ipcRenderer.on(channel, (_, ...parameters: JSONArray) => callback(...parameters));
    }

    /*
    Handle(channel: Channels.Reply.FromRender, callback: (result: JSONElement) => void): void;

    public Handle(channel: string, callback: Callback): void {
        // TODO: Implement mechanism to receive a response ...
        globalThis.ipcRenderer.on(channel, (_, nonce: string, ...parameters: JSONArray) => callback(...parameters));
        // TODO: send back to nonce ...
    }
    */

    /**
     * Send an event from the Render process to the Main process
     * @remarks This message will trigger `ipcMain.on(channel, listener)`
     * @param channel - ...
     * @param parameters - ...
     * @returns ...
     */
    public Send(channel: string, ...parameters: JSONArray): void {
        globalThis.ipcRenderer.send(channel, ...parameters);
    }

    //Invoke(channel: Channels.FetchProvider.GetSessionCookies, filter: Electron.CookiesGetFilter): Promise<Electron.Cookie[]>;

    /**
     * Invoke a method in the Main process from the Render process
     * @remarks This message will trigger `ipcMain.handle(channel, listener)`
     * @param channel - ...
     * @param parameters - ...
     * @returns ...
     */
    public Invoke<T extends JSONElement>(channel: string, ...parameters: JSONArray): Promise<T> {
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