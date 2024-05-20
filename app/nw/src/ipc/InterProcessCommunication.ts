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
            for(const method of this.subscriptions.get(message.channel)) {
                method(...message.parameters).then(callback);
            }
            return true;
        } else {
            return false;;
        }
    }

    public Listen(channel: TChannelsIn, callback: Callback) {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        // TODO: Prevent duplicate callbacks
        this.subscriptions.get(channel).push(callback);
    }

    public async Send(channel: TChannelsOut, ...parameters: JSONArray): Promise<void> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active: true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        return new Promise<void>(resolve => {
            if(tab?.id) {
                chrome.tabs.sendMessage<Message, void>(tab.id, { channel, parameters }, resolve);
            } else {
                throw new Error(); // TODO: Message
            }
        });
    }
}