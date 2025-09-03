import { ipcMain } from 'electron';
import type { FetchProvider } from '../../../src/ipc/Channels';

type ListenSignatures = {
    [ FetchProvider.App.Initialize ]: {
        callback: (fetchApiSupportedPrefix: string) => PromiseLike<void>;
    };
    [ FetchProvider.App.GetSessionCookies ]: {
        callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>;
    };
};

export class IPC<TChannelsOut extends string> {

    constructor(private readonly webContents: Electron.WebContents) {}

    public Send(method: TChannelsOut, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    //Listen(method: FetchProvider.App.Initialize, callback: (fetchApiSupportedPrefix: string) => Promise<void>): void;
    //Listen(method: FetchProvider.App.GetSessionCookies, callback: (filter: Electron.CookiesGetFilter) => PromiseLike<Electron.Cookie[]>): void;

    public Listen<T extends keyof ListenSignatures>(method: T, callback: ListenSignatures[ T ][ 'callback' ]): void {
        ipcMain.handle(method, (_, ...parameters: Parameters<ListenSignatures[ T ][ 'callback' ]>) => callback(...parameters));
    }
}