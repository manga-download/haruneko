import type { PlatformIPC } from './InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class NodeWebkitIPC implements PlatformIPC {

    constructor() {
        (async function() {
            //const tab = await chrome.tabs.getCurrent();
            //tab.on
            console.log();
        })();
    }

    async RestartRPC(): Promise<void> {
        // send to IPC main (background-page)
        //window.postMessage
        //window.addEventListener('message', )

        //chrome.tabs.sendMessage
        //chrome.runtime.sendMessage();
    }
}