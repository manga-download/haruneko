import { FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { ISetting, ISettings, SettingsManager } from '../SettingsManager';
import type { StorageController } from '../StorageController';
import icon from '../../img/media.png';
import type { Tag } from '../Tags';
import type { Priority } from '../taskpool/TaskPool';

export type IMediaChild = IMediaContainer | IMediaItem;

export interface IMediaItem {
    readonly Parent: IMediaContainer;
    // TODO: Mark as obsolete ...
    readonly SourceURL: string;
    Fetch(priority: Priority): Promise<Blob>;
}

export abstract class MediaItem implements IMediaItem {

    public constructor(public readonly Parent: IMediaContainer) {
    }

    // TODO: Mark as obsolete ...
    public abstract get SourceURL(): string;
    public abstract Fetch(priority: Priority): Promise<Blob>;
}

export interface IMediaContainer {
    readonly Parent?: IMediaContainer;
    readonly Identifier: string;
    readonly Title: string;
    readonly Settings: ISettings;
    readonly Icon: string;
    readonly Tags: Tag[];
    readonly Entries: IMediaChild[];
    [Symbol.iterator](): Iterator<IMediaChild>;
    CreateEntry(identifier: string, title: string): IMediaChild;
    TryGetEntry(url: string): Promise<IMediaChild>;
    Update(): Promise<void>;
}

export abstract class MediaContainer<T extends IMediaChild> implements IMediaContainer {

    protected _entries: T[] = [];

    constructor(public readonly Identifier: string, public readonly Title: string, public readonly Parent?: IMediaContainer) {
    }

    public get Settings(): ISettings {
        return null;
    }

    public get Icon(): string {
        return icon;
    }

    public get Tags(): Tag[] {
        return [];
    }

    public get Entries(): T[] {
        return this._entries;
    }

    public *[Symbol.iterator](): Iterator<T> {
        for (const entry of this.Entries) {
            yield entry;
        }
    }

    protected async Initialize(): Promise<void> {
        if (this.Parent) {
            await (this.Parent as MediaContainer<IMediaContainer>).Initialize();
        }
        // NOTE: nonce method, disable after called once
        this.Initialize = () => Promise.resolve();
    }

    public CreateEntry(identifier: string, title: string): T {
        throw new Error(/* Not implemented! */);
    }

    public async TryGetEntry(url: string): Promise<T> {
        throw new Error(/* Not implemented! */);
    }

    public abstract Update(): Promise<void>;
}

export abstract class MediaScraper<T extends IMediaContainer> {

    public readonly URI: URL;
    public readonly Tags: Tag[];
    public readonly Settings: Record<string, ISetting> & Iterable<ISetting> = {
        *[Symbol.iterator](): Iterator<ISetting> {
            for(const setting of Object.values<ISetting>(this)) {
                yield setting;
            }
        }
    };

    public constructor(public readonly Identifier: string, public readonly Title: string, url: string, ...tags: Tag[]) {
        this.URI = new URL(url);
        this.Tags = tags;
    }

    public abstract CreatePlugin(storageController: StorageController, settingsManager: SettingsManager): T;

    public async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, '');
    }

    public get Icon(): string {
        return icon;
    }
}