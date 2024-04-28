type SubscriberCallback<TValue, TOwner> = (value: TValue, owner: TOwner) => void;

export class Observable<TValue, TOwner = null> {

    private readonly subscribers = new Set<SubscriberCallback<TValue, TOwner>>();

    /**
     * Create a new observable instance.
     * @param value - The initial value of the observer
     * @param owner - An optional owner associated with the {@link value}
     */
    constructor(private value: TValue, private readonly owner?: TOwner) {}

    /**
     * Receive the current value of the observer.
     */
    public get Value(): TValue {
        return this.value;
    }

    /**
     * Update the current value of the observer and notify all subscribers if value was changed.
     * @description
     * Subscribers will only be notified for assignments of the value itself.
     * Mutations within the value (e.g., object or array content) are not detected.
     */
    public set Value(value: TValue) {
        if(this.value !== value) {
            this.value = value;
            this.Dispatch();
        }
    }

    /**
     * Invoke all registered subscribers passing the current value and owner.
     */
    public Dispatch(): void {
        for(const subscription of this.subscribers) {
            try {
                subscription(this.value, this.owner);
            } catch { /* IGNORE SUBSCRIBER ERRORS */ }
        }
    }

    /**
     * Register a {@link callback} that gets invoked whenever the {@link Value} is changed or a notification is forced via {@link Dispatch}.
     */
    public Subscribe(callback: SubscriberCallback<TValue, TOwner>): void {
        this.subscribers.add(callback);
    }

    /**
     * Unregister the {@link callback} from any further notifications.
     */
    public Unsubscribe(callback: SubscriberCallback<TValue, TOwner>): void {
        this.subscribers.delete(callback);
    }
}