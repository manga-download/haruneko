import type { JSONArray, JSONObject } from 'websocket-rpc/dist/types';

type IPCPayload = {
    name: string,
    parameters: JSONArray,
}

type IPCResponse = JSONObject | void;

export class IPC {

    constructor() {
        chrome.runtime.onMessage.addListener(this.Receive.bind(this));
    }

    private async Receive<M, R>(message: M, sender: chrome.runtime.MessageSender, callback: (response: R) => void) {
        console.log('App::IPC.Received', message, sender, callback);
        //callback();
    }

    public async Send<P extends IPCPayload, R extends IPCResponse>(payload: P): Promise<R> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active : true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        if(tab?.id) {
            console.log('App::IPC.Send::???', payload);
            return chrome.tabs.sendMessage<P, R>(tab.id, payload);
        } else {
            throw new Error(/* TODO: Message */);
        }
    }
}