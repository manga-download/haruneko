import { DownloadTask, Status } from './DownloadTask';
import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import type { StorageController } from './StorageController';
import { Event } from './Event';

export class DownloadManager {

    private processing = false;
    private queue: DownloadTask[] = [];
    private queueTransactionLock = false;
    public readonly TasksAdded: Event<typeof this, DownloadTask[]> = new Event<typeof this, DownloadTask[]>();
    public readonly TasksRemoved: Event<typeof this, DownloadTask[]> = new Event<typeof this, DownloadTask[]>();

    constructor(private readonly storageController: StorageController) {
    }

    /**
     * Perform a thread/concurrency safe operation on {@link queue}
     */
    private async InvokeQueueTransaction<R>(transaction: (queue: DownloadTask[]) => R): Promise<R> {
        try {
            // TODO: Use a better locking mechanism?
            while(this.queueTransactionLock) {
                await new Promise(resolve => setTimeout(resolve, 5));
            }
            this.queueTransactionLock = true;
            return transaction(this.queue);
        } finally {
            this.queueTransactionLock = false;
        }
    }

    public GetTasks(): Promise<DownloadTask[]> {
        return this.InvokeQueueTransaction(queue => queue.map(task => task));
    }

    /**
     * Add the given {@link containers} to the download queue.
     * Only containers that are not present in the download queue will be added.
     */
    public async Enqueue(...containers: StoreableMediaContainer<MediaItem>[]): Promise<void> {
        const added = await this.InvokeQueueTransaction(queue => {
            const result = [];
            for(const container of containers) {
                if(queue.none(task => container?.IsSameAs(task.Media))) {
                    const task = new DownloadTask(container, this.storageController);
                    result.push(task);
                    queue.push(task);
                }
            }
            return result;
        });
        this.TasksAdded.Dispatch(this, added);
        this.Process();
    }

    /**
     * Remove the given {@link tasks} from the download queue.
     * Only tasks that are present in the download queue will be removed.
     */
    public async Dequeue(...tasks: DownloadTask[]): Promise<void> {
        const removed = await this.InvokeQueueTransaction(queue => {
            const result = [];
            this.queue = queue.filter(task => {
                if(tasks.includes(task)) {
                    result.push(task);
                    task.Abort();
                    return false;
                } else {
                    return true;
                }
            });
            return result;
        });
        this.TasksRemoved.Dispatch(this, removed);
    }

    private async Process() {
        if(this.processing) {
            return;
        }
        this.processing = true;

        while(this) {
            try {
                const task = this.queue.find(t => t.Status === Status.Queued);
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