type Message = {
    channel: string,
    parameters: JSONArray,
}

type Callback = (...parameters: JSONArray) => Promise<void>;

export namespace Channels {

    /** Supported IPC Channels for interacting with the RPC manager. */
    export namespace RemoteProcedureCallManager {

        /**
         * Send from the Background script and received/processsed in the Content script.
         */
        export type Web = never;

        /**
         * Send from the Content script and received/processed in the Background script.
         */
        export const enum App {
            Stop = 'RemoteProcedureCallManager::Stop',
            Restart = 'RemoteProcedureCallManager::Restart',
        };
    }

    /** Supported IPC Channels for interacting with the RPC contract callbacks. */
    export namespace RemoteProcedureCallContract {

        /**
         * Send from the Background script and received/processed in the Content script.
         */
        export const enum Web {
            LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
        };

        /**
         * Send from the Content script and received/procesed in the Background script.
         */
        export type App = never;
    }
}

export class IPC {

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

    // TODO: Signature declarations for `Listen`

    Listen(channel: Channels.RemoteProcedureCallManager.App.Stop, callback: () => Promise<void>): void;
    //Listen(channel: Channels.RemoteProcedureCallManager.App.Restart, callback: (port: number, secret: string) => Promise<void>): void;

    public Listen(channel: string, callback: Callback): void {
        if(!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, []);
        }
        const methods = this.subscriptions.get(channel);
        if(!methods.includes(callback)) {
            methods.push(callback);
        }
    }

    // TODO: Signature declarations for `Send`
    Send(channel: Channels.RemoteProcedureCallContract.Web.LoadMediaContainerFromURL, url: string): Promise<void>;

    public async Send(channel: string, ...parameters: JSONArray): Promise<void> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active: true }, resolve));
        const tab = tabs.length > 0 ? tabs.at(0) : undefined;
        if(tab?.id) {
            return new Promise<void>(resolve => chrome.tabs.sendMessage<Message, void>(tab.id, { channel, parameters }, resolve));
        } else {
            throw new Error(); // TODO: Message
        }
    }
}