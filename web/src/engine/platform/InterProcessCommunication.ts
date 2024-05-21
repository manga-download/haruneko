import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitIPC from './nw/InterProcessCommunication';
import ElectronIPC from './electron/InterProcessCommunication';

export type Callback = (...parameters: JSONArray) => Promise<void>;

export interface IPC<TChannelsOut extends string, TChannelsIn extends string> {
    Listen(channel: TChannelsIn, callback: Callback): void;
    Send<T extends void | JSONElement>(channel: TChannelsOut, ...parameters: JSONArray): Promise<T>;
}

let instance: IPC<string, string>;

export default function GetIPC() {
    if(!instance) {
        instance = new PlatformInstanceActivator<IPC<string, string>>()
            .Configure(Runtime.NodeWebkit, () => new NodeWebkitIPC())
            .Configure(Runtime.Electron, () => new ElectronIPC())
            .Create();
    }
    return instance;
}