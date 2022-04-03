import { DownloadTask, Status } from './DownloadTask';
import type { IMediaContainer } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import { Event } from './EventManager';

export class DownloadManager {

    private paused = false;
    private readonly queue: DownloadTask[] = [];
    public readonly EntryAdded: Event<typeof this, DownloadTask> = new Event<typeof this, DownloadTask>();

    constructor(private readonly storageController: StorageController, private readonly settingsManager: SettingsManager) {
        this.Process();
    }

    public Enqueue(media: IMediaContainer): DownloadTask {
        const task = new DownloadTask(media);
        this.queue.push(task);
        return task;
    }

    public Dequeue(... tasks: DownloadTask[]): void {
        // find task(s) in queue and remove ...
    }

    private async Process() {
        while(this) {
            const task = this.queue.find(t => t.Status === Status.Queued);
            if(task && !this.paused) {
                await task.Run();
                // TODO: keep task in queue after completed?
            } else {
                await new Promise(resolve => setTimeout(resolve, 750));
            }
        }
    }

    public Pause() {
        this.paused = true;
    }

    public Resume() {
        this.paused = false;
    }
}