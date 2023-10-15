import { InternalError } from '../Error';
import type { SettingsManager } from '../SettingsManager';
import type { PlatformIPC } from './InterProcessCommunication';
import { NodeWebkitIPC } from './NodeWebkit';

export function CreatePlatformIPC(settingsManager: SettingsManager): PlatformIPC {
    if(window.nw) {
        return new NodeWebkitIPC(settingsManager);
    }
    /*
    if('electron' in window) {
        return new ElectronIPC();
    }
    */
    throw new InternalError('Platform not supported!');
}