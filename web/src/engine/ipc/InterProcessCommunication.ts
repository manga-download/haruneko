import { NodeWebkitIPC } from './NodeWebkit';

export interface PlatformIPC {
    RestartRPC: () => Promise<void>;
}

export function CreatePlatformIPC(): PlatformIPC {
    if(window.nw) {
        return new NodeWebkitIPC();
    }
    /*
    if('electron' in window) {
        return new ElectronIPC();
    }
    if(window.nw) {
        return new BrowserIPC();
    }
    */
    throw new Error('Platform not supported!');
}