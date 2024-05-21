import type { SettingsManager } from '../SettingsManager';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import NodeWebkitRemoteProcedureCallManager from './nw/RemoteProcedureCallManager';
import ElectronRemoteProcedureCallManager from './electron/RemoteProcedureCallManager';
import GetIPC from './InterProcessCommunication';

export interface IRemoteProcedureCallManager {
    Stop(): Promise<void>;
    Restart(port: number, secret: string): Promise<void>;
}

export function CreateRemoteProcedureCallManager(settingsManager: SettingsManager): IRemoteProcedureCallManager {
    return new PlatformInstanceActivator<IRemoteProcedureCallManager>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitRemoteProcedureCallManager(GetIPC(), settingsManager))
        .Configure(Runtime.Electron, () => new ElectronRemoteProcedureCallManager(GetIPC(), settingsManager))
        .Create();
}