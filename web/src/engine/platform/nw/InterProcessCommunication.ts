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
            for(const method of this.subscriptions.get(message.channel)) {
                method(...message.parameters).then(callback);
            }
            return true;
        } else {
            return false;;
        }
    }

    public Listen(channel: string, callback: Callback): void {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        // TODO: Prevent duplicate callbacks
        this.subscriptions.get(channel).push(callback);
    }

    public async Send(channel: string, ...parameters: JSONArray): Promise<void> {
        return new Promise<void>(resolve => chrome.runtime.sendMessage<Message, void>({ channel, parameters }, resolve));
    }
}