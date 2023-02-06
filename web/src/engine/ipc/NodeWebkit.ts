import type { PlatformIPC } from './InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class NodeWebkitIPC implements PlatformIPC {

    async RestartRPC(): Promise<void> {
        // send to IPC main
    }
}