type Message = {
    channel: string,
    parameters: JSONArray,
}

type Callback = (...parameters: JSONArray) => Promise<void>;

export class IPC<TChannelsOut extends string, TChannelsIn extends string> {

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

    public Listen(channel: TChannelsIn, callback: Callback) {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        const methods = this.subscriptions.get(channel);
        if(!methods.includes(callback)) {
            methods.push(callback);
        }
    }

    public async Send(channel: TChannelsOut, ...parameters: JSONArray): Promise<void> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active: true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        if(tab?.id) {
            return new Promise<void>(resolve => chrome.tabs.sendMessage<Message, void>(tab.id, { channel, parameters }, resolve));
        } else {
            throw new Error(); // TODO: Message
        }
    }
}