import type { IFrontendInfo, IFrontendModule } from '../frontend/IFrontend';
import type { Code } from '../i18n/ILocale';

export class Event<TSender, TArgs> {

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
    public readonly FrontendLoaded: Event<IFrontendModule, IFrontendInfo> = new Event<IFrontendModule, IFrontendInfo>();
    public readonly LocaleChanged: Event<void, Code> = new Event<void, Code>();
}