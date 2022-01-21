import { FetchRequest, FetchWindowScript } from '../FetchProvider';

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
    //readonly Language: string;
    readonly Entries: IMediaChild[];
    [Symbol.iterator](): Iterator<IMediaChild>;
    TryGetEntry(url: string): Promise<IMediaChild>;
    Update(): Promise<void>;
}

export abstract class MediaContainer<T extends IMediaChild> implements IMediaContainer {

    protected _entries: T[];

    constructor(identifier: string, title: string, parent?: IMediaContainer) {
        this.Parent = parent;
        this.Identifier = identifier;
        this.Title = title;
        this._entries = [];
    }

    public readonly Parent?: IMediaContainer;
    public readonly Identifier: string;
    public readonly Title: string;

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

    public abstract TryGetEntry(url: string): Promise<T>;
    public abstract Update(): Promise<void>;
}

export abstract class MediaScraper {

    public readonly Identifier: string;
    public readonly Title: string;
    public readonly URI: URL;

    public constructor(identifier: string, title: string, url: string) {
        this.Identifier = identifier;
        this.Title = title;
        this.URI = new URL(url);
    }

    //readonly Icon: Image;
    //readonly Tags: object[];

    public abstract CreatePlugin(): MediaContainer<IMediaContainer>;

    // TODO: Maybe only run once?
    public async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, '');
    }
}