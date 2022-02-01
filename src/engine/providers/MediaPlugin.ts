import { FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { ISetting, ISettings, SettingsManager } from '../SettingsManager';
import type { StorageController } from '../StorageController';
import type { Tag } from '../Tags';

export type IMediaChild = IMediaContainer | IMediaItem;

export interface IMediaItem {
    readonly Parent: IMediaContainer;
    readonly SourceURL: string;
    Download(): Promise<void>;
    Abort(): Promise<void>;
}

export abstract class MediaItem implements IMediaItem {

    public constructor(parent: IMediaContainer) {
        this.Parent = parent;
    }

    public readonly Parent: IMediaContainer;
    public abstract get SourceURL(): string;
    public abstract Download(): Promise<void>;
    public abstract Abort(): Promise<void>;
}

export interface IMediaContainer {
    readonly Parent?: IMediaContainer;
    readonly Identifier: string;
    readonly Title: string;
    readonly Settings: ISettings;
    readonly Tags: Tag[];
    readonly Entries: IMediaChild[];
    [Symbol.iterator](): Iterator<IMediaChild>;
    CreateEntry(identifier: string, title: string): IMediaChild;
    TryGetEntry(url: string): Promise<IMediaChild>;
    Update(): Promise<void>;
}

export abstract class MediaContainer<T extends IMediaChild> implements IMediaContainer {

    protected _entries: T[] = [];

    constructor(identifier: string, title: string, parent?: IMediaContainer) {
        this.Parent = parent;
        this.Identifier = identifier;
        this.Title = title;
    }

    public readonly Parent?: IMediaContainer;
    public readonly Identifier: string;
    public readonly Title: string;

    public get Settings(): ISettings {
        return null;
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

    public readonly Identifier: string;
    public readonly Title: string;
    public readonly URI: URL;
    public readonly Tags: Tag[];
    public readonly Settings: Record<string, ISetting> & Iterable<ISetting> = {
        *[Symbol.iterator](): Iterator<ISetting> {
            for(const setting of Object.values<ISetting>(this)) {
                yield setting;
            }
        }
    }

    public constructor(identifier: string, title: string, url: string, ...tags: Tag[]) {
        this.Identifier = identifier;
        this.Title = title;
        this.URI = new URL(url);
        this.Tags = tags;
    }

    //readonly Icon: Image;

    public abstract CreatePlugin(storageController: StorageController, settingsManager: SettingsManager): T;

    public async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, '');
    }
}