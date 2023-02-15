import type { PlatformIPC } from './InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class NodeWebkitIPC implements PlatformIPC {

    constructor() {
        chrome.runtime.onMessage.addListener(this.Receive.bind(this));
    }

    private async Receive<M, R>(message: M, sender: chrome.runtime.MessageSender, callback: (response: R) => void) {
        // is message always serialized JSON string?
        console.log('Web::IPC.Received', message, sender, callback);
        //callback();
    }

    public async RestartRPC(): Promise<void> {
        // send to IPC main (background-page)
        console.log('Web::IPC.Send::RestartRPC');
        return chrome.runtime.sendMessage<unknown, void>({ name: 'IPC::RestartRPC', parameters: [] });
    }
}