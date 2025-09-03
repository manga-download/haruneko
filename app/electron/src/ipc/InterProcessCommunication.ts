import { ipcMain } from 'electron';
import type * as Channels from '../../../src/ipc/Channels';

type SendChannels = Channels.ApplicationWindow.Web | Channels.FetchProvider.Web;
type ListenChannels = Channels.FetchProvider.App;

export class IPC {

    constructor(private readonly webContents: Electron.WebContents) {}

    Send(method: Channels.FetchProvider.Web.OnBeforeSendHeaders, details: Pick<Electron.OnBeforeSendHeadersListenerDetails, 'url' | 'requestHeaders'>): void;

    public Send(method: SendChannels, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    Listen(method: Channels.FetchProvider.App.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    Listen(method: Channels.FetchProvider.App.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;

    public Listen<TParameters extends JSONArray, TReturn extends void | JSONElement>(method: ListenChannels, callback: (...parameters: TParameters) => PromiseLike<TReturn>): void {
        ipcMain.handle(method, (_, ...parameters: TParameters) => callback(...parameters));
    }
}