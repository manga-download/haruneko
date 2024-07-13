export class DeferredPromise<T> {

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });
    }

    private readonly promise: Promise<T>;
    public get Promise() { return this.promise; }

    #resolve: (value: T) => void;
    public get Resolve() { return this.#resolve; }

    #reject: (reason: Error) => void;
    public get Reject() { return this.#reject; }
}