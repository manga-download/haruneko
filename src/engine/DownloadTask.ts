import type { IMediaContainer, IMediaItem } from './providers/MediaPlugin';
import { Event } from './EventManager';
import { Priority } from './taskpool/DeferredTask';

export const enum Status {
    Paused = 'paused',
    Queued = 'queued',
    Started = 'started',
    Completed = 'completed',
    Failed = 'failed',
}

export interface IDownloadTask {
    readonly ID: symbol;
    readonly Created: Date;
    readonly Media: IMediaContainer;
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

    constructor(public readonly Media: IMediaContainer) {
    }

    private status: Status = Status.Queued;
    public get Status(): Status {
        return this.status;
    }
    private set Status(value: Status) {
        if(this.status !== value) {
            this.status = value;
            this.StatusChanged.Dispatch(this, this.status);
        }
    }

    public get Progress(): number {
        return this.Media.Entries.length ? this.completed / this.Media.Entries.length : 0
    }

    private completed = 0;
    private get Completed(): number {
        return this.completed;
    }
    private set Completed(value: number) {
        if(this.completed !== value) {
            this.completed = value;
            this.ProgressChanged.Dispatch(this, this.Progress);
        }
    }

    public async Run(/* Target Directory / Archive ? */): Promise<void> {

        // Determine type manga/anime/novel

        this.Status = Status.Started;
        try {
            await this.Media.Update();
            const promises = this.Media.Entries.map(async (page: IMediaItem) => {
                const data = await page.Fetch(Priority.Low);
                // TODO: Save data to target directory / archive
                this.Completed++;
                return ''; // `DATA: ${data.size / 1024} KB | ${data.type}`;
            });
            const results = await Promise.allSettled(promises);
            const values = results.filter(promise => promise.status === 'fulfilled').map(promise => (promise as PromiseFulfilledResult<string>).value);
            const errors = results.filter(promise => promise.status === 'rejected').map(promise => (promise as PromiseRejectedResult).reason);
            this.Completed = values.length;
            if(errors.length > 0) {
                throw new Error(errors.join('\n\n'));
            }
            this.Status = Status.Completed;
            //return values;
        } catch(error) {
            this.Status = Status.Failed;
            throw error;
        }
    }
}