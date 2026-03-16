import type { Callback } from '../InterProcessCommunication';
import { Channels } from '../../../../../app/nw/src/ipc/InterProcessCommunication';

type Message = {
    channel: string,
    parameters: JSONArray,
}

class IPC {

    private readonly subscriptions = new Map<string, Callback[]>;

    constructor() {
        chrome.runtime.onMessage.addListener(this.OnMessage.bind(this));
    }

    private OnMessage(message: Message, sender: chrome.runtime.MessageSender, callback: (response: void) => void): boolean {
        if(this.subscriptions.has(message.channel)) {
            const promises = this.subscriptions.get(message.channel).map(method => method(...message.parameters));
            Promise.allSettled(promises).then(() => callback());
            return true;
        } else {
            return false;
        }
    }

    Listen(channel: Channels.RemoteProcedureCallContract.Web.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;

    public Listen(channel: string, callback: (...parameters: JSONArray) => Promise<void>): void {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        const methods = this.subscriptions.get(channel);
        if(!methods.includes(callback)) {
            methods.push(callback);
        }
    }

    Send(channel: Channels.RemoteProcedureCallManager.App.Stop): Promise<void>;
    Send(channel: Channels.RemoteProcedureCallManager.App.Restart, port: number, secret: string): Promise<void>;

    public Send<T extends void | JSONElement>(channel: string, ...parameters: JSONArray): Promise<T> {
        return new Promise<T>(resolve => chrome.runtime.sendMessage<Message, T>({ channel, parameters }, resolve));
    }
}

let instance: IPC = undefined;

export function GetIPC() {
    if (!instance) {
        instance = new IPC();
    }
    return instance;
}