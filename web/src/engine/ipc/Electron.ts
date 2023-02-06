import type { PlatformIPC } from './InterProcessCommunication';

/**
 * Inter Process Communication for Electron (main process)
 */
export class ElectronIPC implements PlatformIPC {

    async RestartRPC(): Promise<void> {
        // send to IPC main
    }
}