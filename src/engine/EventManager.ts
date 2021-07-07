import { IFrontendInfo, IFrontendModule } from '../frontend/IFrontend';

export interface IEvent<TSender, TArgs> {
    Dispatch(sender: TSender, args: TArgs): void;
    Subscribe(callback: (sender: TSender, args: TArgs) => void): void;
    Unsubscribe(callback: (sender: TSender, args: TArgs) => void): void;
}

class Event<TSender, TArgs> {

    private readonly _subscriptions = new Set<(sender: TSender, args: TArgs) => void>();

    public Dispatch(sender: TSender, args: TArgs): void {
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

export interface IEventManager {
    readonly FrontendLoaded: IEvent<IFrontendModule, IFrontendInfo>;
}

export class EventManager implements IEventManager {
    public readonly FrontendLoaded: IEvent<IFrontendModule, IFrontendInfo> = new Event<IFrontendModule, IFrontendInfo>();
}