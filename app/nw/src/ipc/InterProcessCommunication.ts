export namespace Channels {

    /**
     * Supported IPC Channels for managing the RPC service.
     */
    export enum RemoteProcedureCallManager {
        Stop = 'RemoteProcedureCallManager::Stop',
        Restart = 'RemoteProcedureCallManager::Restart',
    };

    /**
     * Supported IPC Channels for using the RPC service.
     */
    export enum RemoteProcedureCallContract {
        LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL',
    };
}

type MessageCallback<TParameters extends JSONArray = JSONArray> = (...parameters: TParameters) => void | Promise<void>;
type RequestCallback<TParameters extends JSONArray = JSONArray, TReturn extends JSONElement | undefined = JSONElement | undefined> = (...parameters: TParameters) => TReturn | Promise<TReturn>;

export class IPC {

    constructor(private readonly win: Window & typeof globalThis) {
        const interval = this.win.setInterval(() => this.Send('APP::IPC::Ready', interval), 250);
    }

    On(channel: never, callback: never): never;

    /**
     * Register a {@link callback} to handle a message from the _Web_ context via `IPC.Send(channel, ...parameters)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: MessageCallback<TParameters>): void {
        this.win.addEventListener(channel, ({ detail }: CustomEvent<TParameters>) => callback(...detail));
    }

    Send(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, url: string): void;
    Send(channel: 'APP::IPC::Ready', interval: number): void;

    /**
     * Send a message to the _Web_ context handled by `IPC.On(channel, callback)`.
     * The sender does not receive a response (fire & forget).
     */
    public async Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): Promise<void> {
        this.win.dispatchEvent(new CustomEvent<TParameters>(channel, { detail: parameters }));
    }

    Handle(channel: Channels.RemoteProcedureCallManager.Stop, callback: () => Promise<undefined>): void;
    Handle(channel: Channels.RemoteProcedureCallManager.Restart, callback: (port: number, secret: string) => Promise<undefined>): void;

    /**
     * Register a {@link callback} to handle a request from the _Web_ context via `IPC.Invoke(channel, ...parameters)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement>(channel: string, callback: RequestCallback<TParameters, TReturn | undefined>): void {
        setTimeout(() => (this.win.addEventListener(channel, async (evt: CustomEvent<unknown>) => {
            const { replyID, parameters } = evt.detail;
            const result = await callback(...parameters);
            // TODO: Consider dispatching error as well ...
            this.win.console.log.call(this.win.console, 'APP::Handle::Result', result);
            this.win.dispatchEvent(new CustomEvent<TReturn>(replyID, { detail: result }));
        })), 500);
    }

    Invoke(channel: never, ...parameters: never): never;

    /**
     * Send a request to the _Web_ context handled by `IPC.Handle(channel, callback)`.
     * The sender receives a response with the result from the handler.
     */
    public async Invoke<TParameters extends JSONArray, TReturn extends JSONElement>(_channel: string, ..._parameters: TParameters): Promise<TReturn | undefined> {
        return undefined;
    }
}