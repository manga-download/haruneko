import { ipcMain } from 'electron';

export type Callback<T extends void | JSONElement = void> = (...parameters: JSONArray) => Promise<T>;

export class IPC<TChannelsOut extends string, TChannelsIn extends string> {

    constructor(private readonly webContents: Electron.WebContents) {}

    public Send(method: TChannelsOut, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    public Listen<T extends void | JSONElement = void>(method: TChannelsIn, callback: Callback<T>) {
        ipcMain.handle(method, (_, ...parameters: JSONArray) => callback(...parameters));
    }
}