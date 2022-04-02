export const enum Priority {
    /**
     * For background processing such as queued downloads
     */
    Low = 2,
    /**
     * 
     */
    Normal = 4,
    /**
     * For realtime processing such as user interaction
     */
    High = 6,
}

export class DeferredTask<T> {

    public readonly Promise: Promise<T>;
    private resolve: (value: T) => void;
    private reject: (error: Error) => void;

    constructor(private readonly action: () => Promise<T>, public readonly Priority: Priority) {
        this.Promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    public async Run(): Promise<void> {
        try {
            this.resolve(await this.action());
        } catch(error) {
            this.reject(error);
        }
    }
}