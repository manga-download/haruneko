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

export class DownloadTask {

    public readonly ID = Symbol();
    public readonly Created = new Date();
    public readonly StatusChanged: Event<typeof this, Status> = new Event<typeof this, Status>();
    public readonly ProgressChanged: Event<typeof this, number> = new Event<typeof this, number>();

    constructor(private readonly media: IMediaContainer) {
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

    private completed = 0;
    public get Completed(): number {
        return this.completed;
    }
    private set Completed(value: number) {
        if(this.completed !== value) {
            this.completed = value;
            this.ProgressChanged.Dispatch(this, this.media.Entries.length ? this.completed / this.media.Entries.length : 0);
        }
    }

    public async Run(/* Target Directory ? */): Promise<void> {

        // Determine type manga/anime/novel

        this.Status = Status.Started;
        try {
            await this.media.Update();
            const promises = this.media.Entries.map(async (page: IMediaItem) => {
                const data = await page.Fetch(Priority.Low);
                this.Completed++;
            });
            const results = await Promise.allSettled(promises);
            this.Status = Status.Completed;
        } catch {
            this.Status = Status.Failed;
        }
    }
}