import type { ISetting, ISettings, SettingsManager } from '../SettingsManager';
import type { StorageController } from '../StorageController';
import type { Tag } from '../Tags';
import type { Priority } from '../taskpool/TaskPool';
import icon from '../../img/media.webp';
import { NotImplementedError } from '../Error';
import { FetchWindowScript } from '../platform/FetchProvider';

export type MediaChild = MediaContainer<MediaChild> | MediaItem;

export abstract class MediaItem {

    public constructor(public readonly Parent: MediaContainer<MediaItem>) {
    }

    public abstract Fetch(priority: Priority, signal: AbortSignal): Promise<Blob>;
}

export abstract class MediaContainer<T extends MediaChild> {

    #tags: Tag[] = [];
    protected _entries: T[] = [];

    constructor(public readonly Identifier: string, public readonly Title: string, public readonly Parent?: MediaContainer<MediaContainer<T>>) {
    }

    public get Settings(): ISettings {
        return null;
    }

    public get URI(): URL {
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

    public abstract Update(): Promise<void>;
}

declare global {
    interface Array<T> {
        /**
         * Returns the elements of an array where each element's `Identifier` property is unique.
         * When the array contains multiple elements with the same `Identifier`, the first element is choosen.
         */
        distinct: T extends MediaContainer<MediaChild> ? () => T[] : never;
    }
}

if (!Array.prototype.distinct) {
    Array.prototype.distinct = function <T extends MediaContainer<MediaChild>>(this: Array<T>): Array<T> {
        function isFirstOccurence(entry: T, index: number, array: Array<T>) {
            return index === array.findIndex(item => item.Identifier === entry.Identifier);
        }
        return this.filter(isFirstOccurence);
    };
}

export abstract class StoreableMediaContainer<T extends MediaItem> extends MediaContainer<T> {

    public abstract get IsStored(): boolean;
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