import type { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunication';

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

    /**
     * Send a message to the _Main_ process handled by `ipcMain.on(channel, listener)`.
     * The sender does not receive a response (fire & forget).
     */
    public Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): void {
        globalThis.ipcRenderer.send(channel, ...parameters);
    }

    /**
     * Register a {@link callback} to handle a request from the _MAin_ process via `ipcMain.invoke(channel, ...args)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(_channel: string, _callback: (...parameters: TParameters) => TReturn | PromiseLike<TReturn>): void {
        throw new Error('Not natively supported by Electron!');
    }

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