import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import { Priority } from './taskpool/DeferredTask';
import type { StorageController } from './StorageController';
import { type IObservable, Observable, ObservableArray } from './Observable';

export const enum Status {
    Paused = 'paused',
    Queued = 'queued',
    Downloading = 'downloading',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
}

export class DownloadTask {

    public readonly ID = Symbol();
    public readonly Created = new Date();

    constructor(public readonly Media: StoreableMediaContainer<MediaItem>, private readonly storageController: StorageController) {}

    private errors = new ObservableArray<Error, typeof this>([], this);
    public get Errors(): IObservable<Error[], typeof this> {
        return this.errors;
    }

    private readonly status = new Observable(Status.Queued, this);
    public get Status(): IObservable<Status, typeof this> {
        return this.status;
    }

    private progress = new Observable(0.0, this);
    public get Progress(): IObservable<number, typeof this> {
        return this.progress;
    }

    private UpdateProgress(processed: number) {
        this.progress.Value = this.Media.Entries.Value.length > 0 ? processed / this.Media.Entries.Value.length : 0.0;
    }

    private get IsRunning(): boolean {
        return this.status.Value === Status.Downloading || this.status.Value === Status.Processing;
    }

    /**
     * Assert that the {@link Media} entries for this download task are valid
     * @throws {@link RangeError} if the media entries are empty
     */
    private AssertMediaEntries() {
        new Array(this.Media.Entries.Value.length - 1);
    }

    public async Run(/* Target Directory / Archive ? */): Promise<void> {

        if(this.IsRunning) {
            return;
        }
        this.errors.Value = [];
        this.status.Value = Status.Downloading;
        this.UpdateProgress(0);

        const resourcemap = new Map<number, string>();
        try {
            const cancellator = new AbortController();
            this.Abort = cancellator.abort.bind(cancellator);
            await this.Media.Update();
            this.AssertMediaEntries();
            const promises = this.Media.Entries.Value.map(async (item, index: number) => {
                try {
                    const data = await item.Fetch(Priority.Low, cancellator.signal);
                    const resource = await this.storageController.SaveTemporary(data);
                    resourcemap.set(index, resource);
                    this.UpdateProgress(resourcemap.size);
                } catch(error) {
                    this.errors.Push(error instanceof Error ? error : new Error(error?.toString()));
                    // TODO: Abort all other pending downloads or keep running?
                    throw error;
                }
            });
            await Promise.allSettled(promises);
            if(this.errors.Value.length === 0) {
                this.UpdateProgress(-1 * this.Media.Entries.Value.length);
                this.status.Value = Status.Processing;
                await this.Media.Store(resourcemap);
            }
        } catch(error) {
            this.errors.Push(error instanceof Error ? error : new Error(error.toString()));
        } finally {
            await this.storageController.RemoveTemporary(...resourcemap.values());
            this.UpdateProgress(resourcemap.size);
            this.status.Value = this.errors.Value.length > 0 ? Status.Failed : Status.Completed;
            this.Abort = this.DisabledAbort;
        }
    }

    private DisabledAbort(/*_reason?: string*/) { /* NO-OP */ }

    public Abort = this.DisabledAbort;
}