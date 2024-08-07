import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import { Priority } from './taskpool/DeferredTask';
import type { StorageController } from './StorageController';
import { Observable, type IObservable } from './Observable';

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

    private errors: Error[] = [];
    public get Errors(): Error[] {
        return this.errors.map(error => error);
    }

    private readonly status = new Observable(Status.Queued, this);
    public get Status(): IObservable<Status, DownloadTask> {
        return this.status;
    }

    private progress = new Observable(0.0, this);
    public get Progress(): IObservable<number, DownloadTask> {
        return this.progress;
    }

    private UpdateProgress(processed: number) {
        this.progress.Value = this.Media.Entries.Value.length > 0 ? processed / this.Media.Entries.Value.length : 0.0;
    }

    private get IsRunning(): boolean {
        return this.status.Value === Status.Downloading || this.status.Value === Status.Processing;
    }

    public async Run(/* Target Directory / Archive ? */): Promise<void> {

        if(this.IsRunning) {
            return;
        }
        this.status.Value = Status.Downloading;
        this.UpdateProgress(0);
        this.errors = [];

        const resourcemap = new Map<number, string>();
        try {
            const cancellator = new AbortController();
            this.Abort = cancellator.abort.bind(cancellator);
            await this.Media.Update();
            // TODO: What if no entries?
            const promises = this.Media.Entries.Value.map(async (item, index: number) => {
                try {
                    const data = await item.Fetch(Priority.Low, cancellator.signal);
                    const resource = await this.storageController.SaveTemporary(data);
                    resourcemap.set(index, resource);
                    this.UpdateProgress(resourcemap.size);
                } catch(error) {
                    this.errors.push(error instanceof Error ? error : new Error(error?.toString()));
                    // TODO: Abort all other pending downloads or keep running?
                    throw error;
                }
            });
            await Promise.allSettled(promises);
            if(this.Errors.length === 0) {
                this.UpdateProgress(-1 * this.Media.Entries.Value.length);
                this.status.Value = Status.Processing;
                await this.Media.Store(resourcemap);
            }
        } catch(error) {
            this.errors.push(error instanceof Error ? error : new Error(error.toString()));
        } finally {
            await this.storageController.RemoveTemporary(...resourcemap.values());
            this.UpdateProgress(resourcemap.size);
            this.status.Value = this.Errors.length > 0 ? Status.Failed : Status.Completed;
            this.Abort = this.DisabledAbort;
        }
    }

    private DisabledAbort(/*_reason?: string*/) { /* NO-OP */ }

    public Abort = this.DisabledAbort;
}