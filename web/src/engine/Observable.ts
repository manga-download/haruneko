type SubscriberCallback<TValue, TOwner> = (value: TValue, owner: TOwner) => void;

export interface IObservable<TValue, TOwner> {
    readonly Value: TValue;
    Subscribe(callback: SubscriberCallback<TValue, TOwner>): void;
    Unsubscribe(callback: SubscriberCallback<TValue, TOwner>): void
}

export class Observable<TValue, TOwner = null> implements IObservable<TValue, TOwner> {

    private readonly subscribers = new Set<SubscriberCallback<TValue, TOwner>>();

    /**
     * Create a new observable instance.
     * @param value - The initial value of the observer
     * @param owner - An optional owner associated with the {@link value}
     */
    constructor(protected value: TValue, private readonly owner?: TOwner) {}

    /**
     * Receive the current value of the observer.
     */
    public get Value(): TValue {
        return this.value;
    }

    /**
     * Update the current value of the observer and notify all subscribers in case the new value differs from the previous value.
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

export class ObservableArray<TEntry, TOwner = null> extends Observable<TEntry[], TOwner> {

    /**
     * {@inheritDoc {@link Array.pop}}
     */
    public Pop(): TEntry | undefined {
        try {
            return this.Value.pop();
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Array.push}}
     */
    public Push(...items: TEntry[]): number {
        try {
            return this.Value.push(...items);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Array.shift}}
     */
    public Shift(): TEntry {
        try {
            return this.Value.shift();
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Array.unshift}}
     */
    public Unshift(...items: TEntry[]) {
        try {
            return this.Value.unshift(...items);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Array.splice}}
     */
    public Splice(start: number, deleteCount: number, ...items: TEntry[]): TEntry[] {
        try {
            return this.Value.splice(start, deleteCount, ...items);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Array.sort}}
     */
    public Sort(compareFn?: (a: TEntry, b: TEntry) => number): TEntry[] {
        try {
            return this.Value.sort(compareFn);
        } finally {
            this.Dispatch();
        }
    }
}

export class ObservableMap<TKey, TValue, TOwner = null> extends Observable<Map<TKey, TValue>, TOwner> {

    /**
     * {@inheritDoc {@link Map.size}}
     */
    public get Size(): number {
        return this.Value.size;
    }

    /**
     * {@inheritDoc {@link Map.has}}
     */
    public Has(key: TKey): boolean {
        return this.Value.has(key);
    }

    /**
     * {@inheritDoc {@link Map.get}}
     */
    public Get(key: TKey): TValue | undefined {
        try {
            return this.Value.get(key);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Map.set}}
     */
    public Set(key: TKey, value: TValue): void {
        try {
            this.Value.set(key, value);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Map.delete}}
     */
    public Delete(key: TKey): boolean {
        try {
            return this.Value.delete(key);
        } finally {
            this.Dispatch();
        }
    }

    /**
     * {@inheritDoc {@link Map.forEach}}
     */
    public ForEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void): void {
        return this.Value.forEach(callbackfn);
    }
}