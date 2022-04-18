import type { IFrontendInfo, IFrontendModule } from '../frontend/IFrontend';
import type { ILocale } from '../i18n/ILocale';

export class Event<TSender, TArgs> {

    private readonly _subscriptions = new Set<(sender: TSender, args: TArgs) => void>();

    public Dispatch(sender: TSender, args: TArgs): void {
        for(const subscription of this._subscriptions) {
            try {
                subscription(sender, args);
            } catch { /* IGNORE SUBSCRIBER ERRORS */ }
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
    public readonly LocaleChanged: Event<void, ILocale> = new Event<void, ILocale>();
}