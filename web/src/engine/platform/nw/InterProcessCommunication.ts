import type { Channels } from '../../../../../app/nw/src/ipc/InterProcessCommunication';

type EventRequest = {
    replyID: string,
    parameters: JSONArray,
}

type MessageCallback<TParameters extends JSONArray = JSONArray> = (...parameters: TParameters) => void | Promise<void>;
type RequestCallback<TParameters extends JSONArray = JSONArray, TReturn extends JSONElement | undefined = JSONElement | undefined> = (...parameters: TParameters) => TReturn | Promise<TReturn>;

export class IPC {

    On(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, callback: (url: string) => Promise<void>): void;

    /**
     * Register a {@link callback} to handle a message from the _App_ context via `IPC.Send(channel, ...parameters)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: MessageCallback<TParameters>): void {
        window.addEventListener(channel, ({ detail }: CustomEvent<TParameters>) => callback(...detail));
    }

    Send(channel: never, ...parameters: never): never;

    /**
     * Send a message to the _App_ context handled by `IPC.On(channel, callback)`.
     * The sender does not receive a response (fire & forget).
     */
    public async Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): Promise<void> {
        window.dispatchEvent(new CustomEvent<TParameters>(channel, { detail: parameters }));
    }

    Handle(channel: never, ...parameters: never): never;

    /**
     * Register a {@link callback} to handle a request from the _App_ context via `IPC.Invoke(channel, ...parameters)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(_channel: string, _callback: RequestCallback<TParameters, TReturn | undefined>): void {
        //this.requestHandlers.set(channel, <RequestCallback>callback);
    }

    Invoke(channel: Channels.RemoteProcedureCallManager.Stop): Promise<undefined>;
    Invoke(channel: Channels.RemoteProcedureCallManager.Restart, port: number, secret: string): Promise<undefined>;

    /**
     * Send a request to the _App_ context handled by `IPC.Handle(channel, callback)`.
     * The sender receives a response with the result from the handler.
     */
    public async Invoke<TParameters extends JSONArray, TReturn extends JSONElement | Void>(channel: string, ...parameters: TParameters): Promise<TReturn | Void> {
        return new Promise<TReturn | Void>(resolve => {
            const replyID = `${channel}#${Date.now()}${Math.random()}`;
            //console.log('Web::IPC::Invoke', channel, '=>', replyID, parameters);
            window.addEventListener(replyID, (evt: CustomEvent<TReturn | undefined>) => {
                //console.log('OK', replyID, evt.detail);
                resolve(evt.detail);
            }, { once: true });
            window.dispatchEvent(new CustomEvent<EventRequest>(channel, { detail: { replyID: replyID, parameters: parameters } }));
        });
    }
}

let instance: IPC;

export function GetIPC() {
    if (!instance) {
        instance = new IPC();
    }
    return instance;
}