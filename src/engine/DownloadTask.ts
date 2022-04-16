import type { IMediaContainer, StoreableMediaContainer, IMediaItem } from './providers/MediaPlugin';
import { Event } from './EventManager';
import { Priority } from './taskpool/DeferredTask';
import type { StorageController } from './StorageController';

export const enum Status {
    Paused = 'paused',
    Queued = 'queued',
    Downloading = 'downloading',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
}

export interface IDownloadTask {
    readonly ID: symbol;
    readonly Created: Date;
    readonly Media: IMediaContainer;
    readonly Errors: Error[];
    readonly Status: Status;
    readonly StatusChanged: Event<typeof this, Status>;
    readonly Progress: number;
    readonly ProgressChanged: Event<typeof this, number>;
}

export class DownloadTask implements IDownloadTask {

    public readonly ID = Symbol();
    public readonly Created = new Date();
    public readonly StatusChanged: Event<IDownloadTask, Status> = new Event<IDownloadTask, Status>();
    public readonly ProgressChanged: Event<IDownloadTask, number> = new Event<IDownloadTask, number>();

    constructor(public readonly Media: StoreableMediaContainer<IMediaItem>, private readonly storageController: StorageController) {
    }

    private errors: Error[] = [];
    public get Errors(): Error[] {
        return this.errors.map(error => error);
    }

    private status: Status = Status.Queued;
    public get Status(): Status {
        return this.status;
    }
    private UpdateStatus(status: Status) {
        if(this.status !== status) {
            this.status = status;
            this.StatusChanged.Dispatch(this, this.status);
        }
    }

    private progress = 0.0;
    public get Progress(): number {
        return this.progress;
    }
    private UpdateProgress(completed: number) {
        const progress = this.Media.Entries.length ? completed / this.Media.Entries.length : 0.0;
        if(this.progress !== progress) {
            this.progress = progress;
            this.ProgressChanged.Dispatch(this, this.progress);
        }
    }

    private get IsRunning(): boolean {
        return this.Status === Status.Downloading || this.Status === Status.Processing;
    }

    public async Run(/* Target Directory / Archive ? */): Promise<void> {

        if(this.IsRunning) {
            return;
        }
        this.UpdateStatus(Status.Downloading);
        this.UpdateProgress(0);
        this.errors = [];

        const resourcemap = new Map<IMediaItem, string>();
        try {
            const cancellator = new AbortController();
            this.Abort = cancellator.abort.bind(cancellator);
            await this.Media.Update();
            // TODO: What if no entries?
            const promises = this.Media.Entries.map(async (item: IMediaItem) => {
                try {
                    const data = await item.Fetch(Priority.Low, cancellator.signal);
                    const resource = await this.storageController.SaveTemporary(data);
                    resourcemap.set(item, resource);
                    this.UpdateProgress(resourcemap.size);
                } catch(error) {
                    this.errors.push(error instanceof Error ? error : new Error(error?.toString()));
                    // TODO: Abort all other pending downloads or keep running?
                    throw error;
                }
            });
            await Promise.allSettled(promises);
            if(this.Errors.length === 0) {
                this.UpdateProgress(-1 * this.Media.Entries.length);
                this.UpdateStatus(Status.Processing);
                await this.Media.Store(resourcemap);
            }
        } catch(error) {
            this.errors.push(error instanceof Error ? error : new Error(error.toString()));
        } finally {
            await this.storageController.RemoveTemporary(...resourcemap.values());
            this.UpdateProgress(resourcemap.size);
            this.UpdateStatus(this.Errors.length > 0 ? Status.Failed : Status.Completed);
            this.Abort = this.DisabledAbort;
        }
    }

    private DisabledAbort(_reason?: string) { /* NO-OP */ }

    public Abort = this.DisabledAbort;
}