import type { IPCParameters, IPCPayload, IPCResponse, AppIPC, WebIPC, PlatformIPC } from '../../../../web/src/engine/ipc/InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    constructor() {
        chrome.runtime.onMessage.addListener(this.Listen.bind(this));
    }

    private async Send<R extends IPCResponse>(method: keyof WebIPC, ...parameters: IPCParameters): Promise<R> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active : true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        return new Promise<R>(resolve => {
            if(tab?.id) {
                console.log(`App::IPC.Send::${method}`, parameters);
                chrome.tabs.sendMessage<IPCPayload<WebIPC>, R>(tab.id, { method, parameters }, resolve);
            } else {
                throw new Error(/* TODO: Message */);
            }
        });
    }

    private Listen(payload: IPCPayload<AppIPC>, sender: chrome.runtime.MessageSender, callback: (response: IPCResponse) => void): boolean | void {
        console.log('App::IPC.Received', payload, sender, callback);
        if(payload.method in this) {
            this[payload.method].call<WebIPC, IPCParameters, Promise<IPCResponse>>(this, ...payload.parameters).then(callback);
            return true;
        } else {
            console.error('No IPC callback handler found for:', payload.method);
        }
    }

    public async RestartRPC() {
        console.log('Invoking: RestartRPC');
        // TODO: Delay backpressure for to many consecutive invocations ...
    }

    public async Foo(id: number) {
        console.log('Invoking: Foo');
        return { id, value: 'Foo!' };
    }

    public async Bar(id: number) {
        console.log('Sending: Bar');
        return this.Send<{ id: number, value: string }>('Bar', id);
    }
}