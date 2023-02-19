import type { IPCParameters, IPCPayload, IPCResponse, AppIPC, WebIPC, PlatformIPC } from './InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (content page)
 */
export class NodeWebkitIPC implements PlatformIPC {

    constructor() {
        chrome.runtime.onMessage.addListener(this.Listen.bind(this));
    }

    private async Send<R extends IPCResponse>(method: keyof AppIPC, ...parameters: IPCParameters): Promise<R> {
        console.log(`Web::IPC.Send::${method}`, parameters);
        return new Promise<R>(resolve => chrome.runtime.sendMessage<IPCPayload<AppIPC>, R>({ method, parameters }, resolve));
    }

    private Listen(payload: IPCPayload<WebIPC>, sender: chrome.runtime.MessageSender, callback: (response: IPCResponse) => void): boolean | void {
        console.log('Web::IPC.Received', payload, sender, callback);
        if(payload.method in this) {
            this[payload.method].call<AppIPC, IPCParameters, Promise<IPCResponse>>(this, ...payload.parameters).then(callback);
            return true;
        } else {
            console.error('No IPC callback handler found for:', payload.method);
        }
    }

    public async RestartRPC() {
        console.log('Sending: RestartRPC');
        return this.Send<void>('RestartRPC');
    }

    public async Foo(id: number) {
        console.log('Sending: Foo');
        return this.Send<{ id: number, value: string }>('Foo', id);
    }

    public async Bar(id: number) {
        console.log('Invoking: Bar');
        return { id, value: 'Bar!' };
    }
}