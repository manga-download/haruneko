import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitRemoteProcedureCallContract from './nw/RemoteProcedureCallContract';
import ElectronRemoteProcedureCallContract from './electron/RemoteProcedureCallContract';
import ipc from './InterProcessCommunication';

export interface IRemoteProcedureCallContract {
    LoadMediaContainerFromURL(url: string): Promise<void>;
}

export function CreateRemoteProcedureCallContract(): IRemoteProcedureCallContract {
    return new PlatformInstanceActivator<IRemoteProcedureCallContract>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitRemoteProcedureCallContract(ipc))
        .Configure(Runtime.Electron, () => new ElectronRemoteProcedureCallContract(ipc))
        .Create();
}