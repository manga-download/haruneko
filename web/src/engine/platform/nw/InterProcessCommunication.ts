import type { Channels } from '../../../../../app/nw/src/ipc/InterProcessCommunication';

type Payload = {
    channel: string,
    parameters: JSONArray,
}

type MessageCallback<TParameters extends JSONArray = JSONArray> = (...parameters: TParameters) => void | Promise<void>;
type RequestCallback<TParameters extends JSONArray = JSONArray, TReturn extends JSONElement | undefined = JSONElement | undefined> = (...parameters: TParameters) => TReturn | Promise<TReturn>;

export class IPC {

    private readonly messageHandlers = new Map<string, MessageCallback>;
    private readonly requestHandlers = new Map<string, RequestCallback>;

    constructor() {
        chrome.runtime.onMessage.addListener(this.OnMessage.bind(this));
    }

    private async GetTabID(): Promise<number> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active: true }, resolve));
        return tabs.at(0)?.id ?? Number.NaN;
    }

    private async OnMessage(message: Payload, _sender: chrome.runtime.MessageSender, sendResponse: (response?: JSONElement) => void): Promise<void> {
        try {
            if (this.messageHandlers.has(message.channel)) {
                const handle = <MessageCallback>this.messageHandlers.get(message.channel);
                await handle(...message.parameters);
            }
            if (this.requestHandlers.has(message.channel)) {
                const handle = <RequestCallback>this.requestHandlers.get(message.channel);
                sendResponse(await handle(...message.parameters));
            }
        } catch (error) {
            console.warn(error);
        }
    }

    On(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;
    public On<TParameters extends JSONArray>(channel: string, callback: MessageCallback<TParameters>): void {
        this.messageHandlers.set(channel, <MessageCallback>callback);
    }

    public async Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): Promise<void> {
        const tab = await this.GetTabID();
        return chrome.tabs.sendMessage<Payload, void>(tab, { channel, parameters });
    }

    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, callback: RequestCallback<TParameters, TReturn | undefined>): void {
        this.requestHandlers.set(channel, <RequestCallback>callback);
    }

    Invoke(channel: Channels.RemoteProcedureCallManager.Stop): Promise<undefined>;
    Invoke(channel: Channels.RemoteProcedureCallManager.Restart, port: number, secret: string): Promise<undefined>;
    public async Invoke<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, ...parameters: TParameters): Promise<TReturn | undefined> {
        const tab = await this.GetTabID();
        return new Promise<TReturn | undefined>(resolve => chrome.tabs.sendMessage<Payload, TReturn>(tab, { channel, parameters }, resolve));
    }
}

let instance: IPC;

export function GetIPC() {
    if (!instance) {
        instance = new IPC();
    }
    return instance;
}