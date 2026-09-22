import { DownloadTask, Status } from './DownloadTask';
import { ObservableArray, type IObservable } from './Observable';
import type { StoreableMediaContainer, MediaItem, MediaContainer, MediaChild } from './providers/MediaPlugin';
import { Store, type StorageController } from './StorageController';
import { Delay, SetTimeout } from './BackgroundTimers';

/**
 * The identifiers and titles of a queued media (and its parents), which are sufficient to re-create it after a restart.
 */
type PersistedTask = {
    website: string;
    manga: string;
    mangaTitle: string;
    chapter: string;
    chapterTitle: string;
};

const persistedQueueKey = 'download-queue';

export class DownloadManager {

    private processing = false;
    private queue = new ObservableArray<DownloadTask, DownloadManager>([], this);
    private queueTransactionLock = false;
    private saveScheduled = false;

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
     * Only containers that are not present in the download queue will be added.
     */
    public async Enqueue(...containers: StoreableMediaContainer<MediaItem>[]): Promise<void> {
        await this.InvokeQueueTransaction(() => {
            const tasks = containers.distinct()
                .filter(container => this.queue.Value.none(task => task.Media.IsSameAs(container)))
                .map(container => new DownloadTask(container, this.storageController));
            this.queue.Push(...tasks);
        });
        this.ScheduleSave();
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
        this.ScheduleSave();
    }

    /**
     * Add the tasks which were still pending when the application was closed to the download queue (see {@link ScheduleSave}).
     * @param websites - The website plugins from which the queued media shall be re-created
     */
    public async Restore(websites: ReadonlyArray<MediaContainer<MediaContainer<MediaChild>>>): Promise<void> {
        const tasks = await this.storageController.LoadPersistent<PersistedTask[]>(Store.Settings, persistedQueueKey) ?? [];
        const containers = tasks.map(task => websites.find(website => website.Identifier === task.website)
            ?.CreateEntry(task.manga, task.mangaTitle).CreateEntry(task.chapter, task.chapterTitle)).filter(container => container);
        await this.Enqueue(...containers as unknown as StoreableMediaContainer<MediaItem>[]);
    }

    /**
     * Persist the tasks of the download queue which are not completed (see {@link Restore}).
     * A burst of changes (e.g. queuing hundreds of chapters, or many short tasks) is written only once, a few seconds later.
     */
    private ScheduleSave(): void {
        if(this.saveScheduled) {
            return;
        }
        this.saveScheduled = true;
        SetTimeout(() => {
            this.saveScheduled = false;
            const tasks: PersistedTask[] = this.queue.Value
                .filter(task => task.Status.Value !== Status.Completed && task.Media.Parent?.Parent)
                .map(({ Media: chapter }) => ({
                    website: chapter.Parent.Parent.Identifier,
                    manga: chapter.Parent.Identifier,
                    mangaTitle: chapter.Parent.Title,
                    chapter: chapter.Identifier,
                    chapterTitle: chapter.Title,
                }));
            this.storageController.SavePersistent(tasks, Store.Settings, persistedQueueKey).catch(error => console.warn('Failed to save the download queue', error));
        }, 2000);
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
                    this.ScheduleSave();
                } else {
                    await new Promise<void>(resolve => SetTimeout(resolve, 750));
                }
            } catch { /* IGNORE */ }
        }

        this.processing = false;
    }
}