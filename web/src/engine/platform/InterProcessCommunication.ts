import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitIPC from './nw/InterProcessCommunication';
import ElectronIPC from './electron/InterProcessCommunication';

export type Callback = (...parameters: JSONArray) => Promise<void>;

export interface IPC {
    Listen(channel: string, callback: Callback): void;
    Send<T extends void | JSONElement>(channel: string, ...parameters: JSONArray): Promise<T>;
}

let instance: IPC;

export default function GetIPC() {
    if(!instance) {
        instance = new PlatformInstanceActivator<IPC>()
            .Configure(Runtime.NodeWebkit, () => new NodeWebkitIPC())
            .Configure(Runtime.Electron, () => new ElectronIPC())
            .Create();
    }
    return instance;
}