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

type RequestEvent<T extends JSONArray> = CustomEvent<{
    replyChannel: string;
    parameters: T;
}>;

type MessageCallback<TParameters extends JSONArray = JSONArray> = (...parameters: TParameters) => void | Promise<void>;
type RequestCallback<TParameters extends JSONArray = JSONArray, TReturn extends JSONElement | Void = JSONElement> = (...parameters: TParameters) => TReturn | Promise<TReturn>;

export class IPC {

    constructor(private readonly win: NWJS_Helpers.win) { }

    private get window(): Window & typeof globalThis {
        return this.win.window as Window & typeof globalThis;
    }

    On(channel: never, callback: never): never;

    /**
     * Register a {@link callback} to handle a message from the _Web_ context via `IPC.Send(channel, ...parameters)`.
     * The sender does not receive a response (fire & forget).
     */
    public On<TParameters extends JSONArray>(channel: string, callback: MessageCallback<TParameters>): void {
        const listener = <EventListener>(({ detail }: CustomEvent<TParameters>) => callback(...detail));
        // TODO: Prevent multiple registrations
        if (this.window.document.readyState === 'complete') {
            this.window.addEventListener(channel, listener);
        }
        this.win.on('loaded', () => {
            this.window.removeEventListener(channel, listener);
            this.window.addEventListener(channel, listener);
        });
    }

    Send(channel: Channels.RemoteProcedureCallContract.LoadMediaContainerFromURL, url: string): void;

    /**
     * Send a message to the _Web_ context handled by `IPC.On(channel, callback)`.
     * The sender does not receive a response (fire & forget).
     */
    public async Send<TParameters extends JSONArray>(channel: string, ...parameters: TParameters): Promise<void> {
        this.window.dispatchEvent(new CustomEvent<TParameters>(channel, { detail: parameters }));
    }

    Handle(channel: Channels.RemoteProcedureCallManager.Stop, callback: () => Promise<Void>): void;
    Handle(channel: Channels.RemoteProcedureCallManager.Restart, callback: (port: number, secret: string) => Promise<Void>): void;

    /**
     * Register a {@link callback} to handle a request from the _Web_ context via `IPC.Invoke(channel, ...parameters)`.
     * The sender receives a response with the result from the {@link callback}.
     */
    public Handle<TParameters extends JSONArray, TReturn extends JSONElement | Void>(channel: string, callback: RequestCallback<TParameters, TReturn>): void {
        const listener = <EventListener>(({ detail: { replyChannel, parameters } }: RequestEvent<TParameters>) => {
            Promise.resolve(callback(...parameters))
                .then(result => {
                    this.window.dispatchEvent(new CustomEvent<TReturn>(replyChannel, { detail: result }));
                }).catch((error: unknown) => {
                    if (error instanceof Error) delete error.cause;
                    this.window.dispatchEvent(new CustomEvent<unknown>(replyChannel, { detail: error }));
                }).catch((error: unknown) => {
                    this.window.dispatchEvent(new CustomEvent<unknown>(replyChannel, { detail: new Error(`${error}`) }));
                });
        });
        // TODO: Prevent multiple registrations
        if (this.window.document.readyState === 'complete') {
            this.window.addEventListener(channel, listener);
        }
        this.win.on('loaded', () => {
            this.window.removeEventListener(channel, listener);
            this.window.addEventListener(channel, listener);
        });
    }

    Invoke(channel: never, ...parameters: never): never;

    /**
     * Send a request to the _Web_ context handled by `IPC.Handle(channel, callback)`.
     * The sender receives a response with the result from the handler.
     */
    public async Invoke<TParameters extends JSONArray, TReturn extends JSONElement | Void>(_channel: string, ..._parameters: TParameters): Promise<TReturn> {
    }
}