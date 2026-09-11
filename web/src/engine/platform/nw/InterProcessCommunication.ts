import type { Channels } from '../../../../../app/nw/src/ipc/InterProcessCommunication';

type Request = {
    replyID: string,
    parameters: JSONArray,
}

type MessageCallback<TParameters extends JSONArray = JSONArray> = (...parameters: TParameters) => void | Promise<void>;
type RequestCallback<TParameters extends JSONArray = JSONArray, TReturn extends JSONElement | undefined = JSONElement | undefined> = (...parameters: TParameters) => TReturn | Promise<TReturn>;

export class IPC {

    constructor() {
        setTimeout(() => window.document.dispatchEvent(new CustomEvent('APP::MEOW', { detail: { web: true } })), 5000);
        setTimeout(() => window.document.addEventListener('WEB::MEOW', evt => console.log('From App Context:', evt.detail)), 500);
    }

    On(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;

    /**
     * Register a {@link callback} to handle a message from the _App_ context via `IPC.Send(channel, ...parameters)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: MessageCallback<TParameters>): void {
        window.document.addEventListener(channel, ({ detail }: CustomEvent<TParameters>) => callback(...detail));
    }

    Send(channel: never, ...parameters: never): never;

    /**
     * Send a message to the _App_ context handled by `IPC.On(channel, callback)`.
     * The sender does not receive a response (fire & forget).
     */
    public async Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): Promise<void> {
        window.document.dispatchEvent(new CustomEvent<TParameters>(channel, { detail: parameters }));
    }

    Handle(channel: never, ...parameters: never): never;

    /**
     * Register a {@link callback} to handle a request from the _App_ context via `IPC.Invoke(channel, ...parameters)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, callback: RequestCallback<TParameters, TReturn | undefined>): void {
        //this.requestHandlers.set(channel, <RequestCallback>callback);
    }

    // RemoteProcedureCallManager
    Invoke(channel: Channels.RemoteProcedureCallManager.Stop): Promise<undefined>;
    Invoke(channel: Channels.RemoteProcedureCallManager.Restart, port: number, secret: string): Promise<undefined>;

    /**
     * Send a request to the _App_ context handled by `IPC.Handle(channel, callback)`.
     * The sender receives a response with the result from the handler.
     */
    public async Invoke<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, ...parameters: TParameters): Promise<TReturn | undefined> {
        const dbg = await new Promise<TReturn | undefined>(resolve => {
            const replyID = `${channel}::${Date.now()}#${Math.random()}`;
            window.document.addEventListener(replyID, (evt: CustomEvent<TReturn | undefined>) => resolve(evt.detail), { once: true });
            window.document.dispatchEvent(new CustomEvent<Request>(channel, { detail: { replyID, parameters } }));
        });
        console.log('WEB::Invoke::Response', '=>', dbg);
        return dbg;
    }
}

let instance: IPC;

export function GetIPC() {
    if (!instance) {
        instance = new IPC();
    }
    return instance;
}