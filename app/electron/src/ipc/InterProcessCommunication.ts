import { ipcMain } from 'electron';
import type * as Channels from '../../../src/ipc/Channels';

export class IPC {

    constructor(private readonly webContents: Electron.WebContents) {}

    // TODO: Signature declarations for `Send`
    Send(method: Channels.FetchProvider.Web.OnBeforeSendHeaders, url: string, requestHeaders: Electron.OnBeforeSendHeadersListenerDetails[ 'requestHeaders' ]): void;

    public Send(method: string, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    // TODO: Signature declarations for `Listen`
    Listen(method: Channels.FetchProvider.App.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    Listen(method: Channels.FetchProvider.App.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;

    public Listen<TParameters extends JSONArray, TReturn extends void | JSONElement>(method: string, callback: (...parameters: TParameters) => PromiseLike<TReturn>): void {
        ipcMain.handle(method, (_, ...parameters: TParameters) => callback(...parameters));
    }
}