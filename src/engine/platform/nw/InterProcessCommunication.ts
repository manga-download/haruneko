import type { IPC, Callback } from '../InterProcessCommunication';

type Message = {
    channel: string,
    parameters: JSONArray,
}

export default class implements IPC<string, string> {

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

    public Listen(channel: string, callback: Callback): void {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        const methods = this.subscriptions.get(channel);
        if(!methods.includes(callback)) {
            methods.push(callback);
        }
    }

    public async Send<T extends void | JSONElement>(channel: string, ...parameters: JSONArray): Promise<T> {
        return new Promise<T>(resolve => chrome.runtime.sendMessage<Message, T>({ channel, parameters }, resolve));
    }
}