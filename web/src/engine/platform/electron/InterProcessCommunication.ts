export interface IPC<TChannelsOut extends string, TChannelsIn extends string> {
    Listen(method: TChannelsIn, callback: (...parameters: JSONArray) => Promise<void>): void;
    Send(method: TChannelsOut, ...parameters: JSONArray): Promise<void>;
}

class InterProcessCommunication implements IPC<string, string> {

    public Listen(method: string, callback: (...parameters: JSONArray) => Promise<void>): void {
        globalThis.ipcRenderer.on(method, (_, ...parameters: JSONArray) => callback(...parameters));
    }

    public async Send(method: string, ...parameters: JSONArray): Promise<void> {
        return globalThis.ipcRenderer.invoke(method, ...parameters);
    }
}

export const ElectronIPC: IPC<string, string> = new InterProcessCommunication();