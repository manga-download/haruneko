import { ipcMain } from 'electron';

export class IPC<TSend extends string, TListen extends string> {

    constructor(private readonly webContents: Electron.WebContents) {}

    public Send(method: TSend, ...parameters: JSONArray): void {
        this.webContents.send(method, ...parameters);
    }

    public Listen(method: TListen, callback: (...args: JSONArray) => Promise<void>) {
        ipcMain.handle(method, (_, ...args: JSONArray) => callback?.call(callback, ...args));
    }
}