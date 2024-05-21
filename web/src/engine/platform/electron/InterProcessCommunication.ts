import type { IPC, Callback } from '../InterProcessCommunication';

export default class implements IPC<string, string> {

    public Listen(channel: string, callback: Callback): void {
        globalThis.ipcRenderer.on(channel, (_, ...parameters: JSONArray) => callback(...parameters));
    }

    public async Send(channel: string, ...parameters: JSONArray): Promise<void> {
        return globalThis.ipcRenderer.invoke(channel, ...parameters);
    }
}