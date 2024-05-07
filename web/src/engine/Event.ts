/**
 * @deprecated Use {@link import('./Observable').Observable} instead.
 */
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