import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitIPC from './nw/InterProcessCommunication';
import ElectronIPC from './electron/InterProcessCommunication';

export type Callback = (...parameters: JSONArray) => PromiseLike<void | JSONElement>;

export interface IPC {
    Listen(channel: string, callback: Callback): void;
    Send(channel: string, ...parameters: JSONArray): void;
    Invoke<T extends JSONElement>(channel: string, ...parameters: JSONArray): Promise<T>;
}

// TODO: If this is only to be used in platform specific dependencies, maybe it can be removed and the dependencies can get their instance without the generic activator
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