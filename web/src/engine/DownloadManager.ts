import { DownloadTask, Status } from './DownloadTask';
import { ObservableArray, type IObservable } from './Observable';
import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import type { StorageController } from './StorageController';
import { Delay, SetTimeout } from './BackgroundTimers';

export class DownloadManager {

    private processing = false;
    private queue = new ObservableArray<DownloadTask, DownloadManager>([], this);
    private queueTransactionLock = false;

    constructor(private readonly storageController: StorageController) {}

    public get Queue(): IObservable<DownloadTask[], DownloadManager> {
        return this.queue;
    }

    /**
     * Perform an (almost) thread/concurrency safe operation on {@link queue}
     */
    private async InvokeQueueTransaction<R>(transaction: () => R): Promise<R> {
        try {
            while(this.queueTransactionLock) await Delay(5);
            this.queueTransactionLock = true;
            return transaction();
        } finally {
            this.queueTransactionLock = false;
        }
    }

    /**
     * Add the given {@link containers} to the download queue.
     * Only containers that are neither present in the download queue nor already stored in the download directory will be added,
     * so queuing all chapters of a manga again (e.g. after clearing the finished tasks) does not download the stored ones once more.
     */
    public async Enqueue(...containers: StoreableMediaContainer<MediaItem>[]): Promise<void> {
        const stored = await Promise.all(containers.map(container => container.RefreshStored().catch(() => false)));
        await this.InvokeQueueTransaction(() => {
            const tasks = containers.filter((_, index) => !stored[index]).distinct()
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
                    await new Promise<void>(resolve => SetTimeout(resolve, 750));
                }
            } catch { /* IGNORE */ }
        }

        this.processing = false;
    }
}