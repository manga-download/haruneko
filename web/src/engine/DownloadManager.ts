import { DownloadTask, Status } from './DownloadTask';
import { ObservableArray, type IObservable } from './Observable';
import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import type { StorageController } from './StorageController';

export class DownloadManager {

    private processing = false;
    private queue = new ObservableArray<DownloadTask, DownloadManager>([], this);
    private queueTransactionLock = false;

    constructor(private readonly storageController: StorageController) {}

    public get Queue(): IObservable<DownloadTask[], DownloadManager> {
        return this.queue;
    }

    /**
     * Perform a thread/concurrency safe operation on {@link queue}
     */
    private async InvokeQueueTransaction<R>(transaction: () => R): Promise<R> {
        try {
            // TODO: Use a better locking mechanism?
            while(this.queueTransactionLock) {
                await new Promise(resolve => setTimeout(resolve, 5));
            }
            this.queueTransactionLock = true;
            return transaction();
        } finally {
            this.queueTransactionLock = false;
        }
    }

    /**
     * Add the given {@link containers} to the download queue.
     * Only containers that are not present in the download queue will be added.
     */
    public async Enqueue(...containers: StoreableMediaContainer<MediaItem>[]): Promise<void> {
        await this.InvokeQueueTransaction(() => {
            const tasks = containers.distinct()
                .filter(container => this.queue.Value.none(task => task.Media.IsSameAs(container)))
                .map(container => new DownloadTask(container, this.storageController));
            this.queue.Push(...tasks);
        });
        this.Process();
    }

    /**
     * Remove the given {@link tasks} from the download queue.
     * Only tasks that are present in the download queue will be removed.
     */
    public async Dequeue(...tasks: DownloadTask[]): Promise<void> {
        await this.InvokeQueueTransaction(() => {
            this.queue.Value = this.queue.Value.filter(task => {
                if(tasks.includes(task)) {
                    task.Abort();
                    return false;
                } else {
                    return true;
                }
            });
        });
    }

    private async Process() {
        if(this.processing) {
            return;
        }
        this.processing = true;

        while(this) {
            try {
                const task = await this.InvokeQueueTransaction(() => this.queue.Value.find(task => task.Status.Value === Status.Queued));
                if(task) {
                    await task.Run();
                } else {
                    await new Promise(resolve => setTimeout(resolve, 750));
                }
            } catch { /* IGNORE */ }
        }

        this.processing = false;
    }
}