import { FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { ISetting, ISettings, SettingsManager } from '../SettingsManager';
import type { StorageController } from '../StorageController';
import type { Tag } from '../Tags';
import type { Priority } from '../taskpool/TaskPool';
import icon from '../../img/media.webp';
import { NotImplementedError } from '../Error';

export type IMediaChild = IMediaContainer | IMediaItem;

export interface IMediaItem {
    readonly Parent: IMediaContainer;
    Fetch(priority: Priority, signal: AbortSignal): Promise<Blob>;
}

export abstract class MediaItem implements IMediaItem {

    public constructor(public readonly Parent: IMediaContainer) {
    }

    public abstract Fetch(priority: Priority, signal: AbortSignal): Promise<Blob>;
}

export interface IMediaContainer {
    readonly Parent?: IMediaContainer;
    readonly Identifier: string;
    readonly Title: string;
    readonly Settings: ISettings;
    readonly Icon: string;
    readonly Tags: Tag[];
    readonly URI?: URL;
    readonly Entries: IMediaChild[];
    [Symbol.iterator](): Iterator<IMediaChild>;
    IsSameAs(other: IMediaContainer): boolean;
    CreateEntry(identifier: string, title: string): IMediaChild;
    TryGetEntry(url: string): Promise<IMediaChild>;
    Update(): Promise<void>;
}

export abstract class MediaContainer<T extends IMediaChild> implements IMediaContainer {

    #tags: Tag[] = [];
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
        return this.#tags;
    }

    public get Entries(): T[] {
        return this._entries;
    }

    public *[Symbol.iterator](): Iterator<T> {
        for (const entry of this.Entries) {
            yield entry;
        }
    }

    public IsSameAs(other: IMediaContainer): boolean {
        if(!this.Identifier || !other?.Identifier) {
            return false;
        }
        if(this.Identifier !== other.Identifier) {
            return false;
        }
        if(this.Parent && other.Parent) {
            return this.Parent.IsSameAs(other.Parent);
        }
        return true;
    }

    protected async Initialize(): Promise<void> {
        if (this.Parent) {
            await (this.Parent as MediaContainer<IMediaContainer>).Initialize();
        }
        // NOTE: nonce method, disable after called once
        this.Initialize = () => Promise.resolve();
    }

    public CreateEntry(_identifier: string, _title: string): T {
        throw new NotImplementedError();
    }

    public TryGetEntry(_url: string): Promise<T> {
        throw new NotImplementedError();
    }

    public abstract Update(): Promise<void>;
}

export abstract class StoreableMediaContainer<T extends IMediaItem> extends MediaContainer<T> {

    public abstract get IsStored(): boolean;
    public abstract Store(resources: Map<number, string>): Promise<void>;
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