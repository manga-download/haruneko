import type { ISetting, ISettings, SettingsManager } from '../SettingsManager';
import type { StorageController } from '../StorageController';
import type { Tag } from '../Tags';
import type { Priority } from '../taskpool/TaskPool';
import icon from '../../img/media.webp';
import { NotImplementedError } from '../Error';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Observable, ObservableArray, type IObservable } from '../Observable';

export type MediaChild = MediaContainer<MediaChild> | MediaItem;

export abstract class MediaItem {

    public constructor(public readonly Parent: MediaContainer<MediaItem>) {
    }

    public abstract Fetch(priority: Priority, signal: AbortSignal): Promise<Blob>;
}

export abstract class MediaContainer<T extends MediaChild> {

    protected readonly tags = new ObservableArray<Tag, this>([], this);
    protected readonly entries = new ObservableArray<T, this>([], this);
    private readonly updating = new Observable<boolean, this>(false, this);

    constructor(public readonly Identifier: string, public readonly Title: string, public readonly Parent?: MediaContainer<MediaContainer<T>>) {}

    public get Settings(): ISettings {
        throw new NotImplementedError();
    }

    public get URI(): URL {
        throw new NotImplementedError();
    }

    public get Icon(): string {
        return icon;
    }

    public get Tags(): IObservable<ReadonlyArray<Tag>, MediaContainer<T>> {
        return this.tags;
    }

    public get Entries(): IObservable<ReadonlyArray<T>, MediaContainer<T>> {
        return this.entries;
    }

    public get IsUpdating(): IObservable<boolean, MediaContainer<T>> {
        return this.updating;
    }

    public *[Symbol.iterator](): Iterator<T> {
        for (const entry of this.entries.Value) {
            yield entry;
        }
    }

    public IsSameAs(other: MediaContainer<T>): boolean {
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
            await this.Parent.Initialize();
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

    protected abstract PerformUpdate(): Promise<T[]>;

    public async Update(): Promise<void> {
        if(this.updating.Value) {
            console.log(`[MediaContainer] ⏸️  Update already in progress for ${this.Identifier}, skipping...`);
            return;
        }

        console.log(`[MediaContainer] 🚀 Starting Update() for ${this.Identifier} (${this.Title})`);
        this.updating.Value = true;

        try {
            console.log(`[MediaContainer] 🔧 Calling Initialize()...`);
            await this.Initialize();
            console.log(`[MediaContainer] ✅ Initialize() completed`);

            console.log(`[MediaContainer] 📥 Calling PerformUpdate()...`);
            const updateStartTime = Date.now();
            const updatedEntries = await this.PerformUpdate();
            const updateDuration = Date.now() - updateStartTime;

            this.entries.Value = updatedEntries;
            console.log(`[MediaContainer] ✅ PerformUpdate() completed in ${updateDuration}ms, ${updatedEntries.length} entries loaded`);
        } catch (error) {
            console.error(`[MediaContainer] ❌ Error during Update() for ${this.Identifier}:`, error);
            throw error;
        } finally {
            this.updating.Value = false;
            console.log(`[MediaContainer] 🏁 Update() finished for ${this.Identifier}`);
        }
    }
}

export abstract class StoreableMediaContainer<T extends MediaItem> extends MediaContainer<T> {

    public abstract get IsStored(): IObservable<boolean, MediaContainer<T>>;
    public abstract Store(resources: Map<number, string>): Promise<void>;
}

export abstract class MediaScraper<T extends MediaContainer<MediaChild>> {

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
        const request = new Request(this.URI.href);
        return FetchWindowScript(request, '');
    }

    public get Icon(): string {
        return icon;
    }
}