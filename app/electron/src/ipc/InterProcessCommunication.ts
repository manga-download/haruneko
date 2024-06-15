import { ipcMain } from 'electron';

export class IPC<TChannelsOut extends string, TChannelsIn extends string> {

    constructor(private readonly webContents: Electron.WebContents) {}

    public Send(method: TChannelsOut, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    public Listen(method: TChannelsIn, callback: (...parameters: JSONArray) => Promise<void>) {
        ipcMain.handle(method, (_, ...parameters: JSONArray) => callback(...parameters));
    }
}