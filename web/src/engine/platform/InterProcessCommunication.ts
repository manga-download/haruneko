import type { SettingsManager } from '../SettingsManager';
import { Runtime } from './PlatformInfo';
import { PlatformInstanceActivator } from './PlatformInstanceActivator';
import type { PlatformIPC } from './nw/InterProcessCommunicationTypes';
import NodeWebkitInterProcessCommunication from './nw/InterProcessCommunication';
import ElectronInterProcessCommunication from './electron/InterProcessCommunication';

export function CreatePlatformIPC(settingsManager: SettingsManager): PlatformIPC {
    return new PlatformInstanceActivator<PlatformIPC>()
        .Configure(Runtime.NodeWebkit, () => new NodeWebkitInterProcessCommunication(settingsManager))
        .Configure(Runtime.Electron, () => new ElectronInterProcessCommunication(settingsManager))
        .Create();
}