import type { IFrontendInfo, IFrontendModule } from '../frontend/IFrontend';
import type { Code } from '../i18n/ILocale';

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

export class EventManager {
    public readonly FrontendLoaded: IEvent<IFrontendModule, IFrontendInfo> = new Event<IFrontendModule, IFrontendInfo>();
    public readonly LocaleChanged: IEvent<void, Code> = new Event<void, Code>();
}