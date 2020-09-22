export interface IEvent<TSender, TArgs> {
    Dispatch(sender: TSender, args: TArgs): void;
    Subscribe(callback: (sender: TSender, args: TArgs) => void): void;
    Unsubscribe(callback: (sender: TSender, args: TArgs) => void): void;
}

class Event<TSender, TArgs> {

    private readonly _subscriptions = new Set<(sender: TSender, args: TArgs) => void>();

    public Dispatch(sender: TSender, args: TArgs): void {
        // callback all subscribers
        for(const subscription of this._subscriptions) {
            subscription(sender, args);
        }
    }

    public Subscribe(callback: (sender: TSender, args: TArgs) => void): void {
        this._subscriptions.add(callback);
    }

    public Unsubscribe(callback: (sender: TSender, args: TArgs) => void): void {
        this._subscriptions.delete(callback);
    }
}

export interface IEventEmitter {
    OnFooBar: IEvent<number, string>;
}

export class EventEmitter implements IEventEmitter {

    private readonly _onFooBar = new Event<number, string>();

    public get OnFooBar(): IEvent<number, string> {
        return this._onFooBar;
    }
}