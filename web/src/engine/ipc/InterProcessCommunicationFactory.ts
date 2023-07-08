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
    // TODO: Localization ...
    throw new Error('Platform not supported!');
}