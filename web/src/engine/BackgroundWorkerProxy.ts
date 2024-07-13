import { DeferredPromise } from './DeferredPromise';

export class BackgroundWorkerProxy {

    private readonly pending = new Map<string, DeferredPromise<unknown>>();

    constructor(private readonly worker: Worker) {
        worker.addEventListener('message', (event) => {
            console.log('Worker (response):', event.data);
            const deferred = this.pending.get(event.data.id);
            deferred.Resolve(event.data.payload);
        });
    }

    public PostMessage<P, R>(action: string, payload: P): Promise<R> {
        const id = action + '::' + Date.now() + Math.random();
        const message = { id, action, payload };
        const deferred = new DeferredPromise<R>();
        this.pending.set(message.id, deferred);
        this.worker.postMessage(message);
        return deferred.Promise;
    }
}