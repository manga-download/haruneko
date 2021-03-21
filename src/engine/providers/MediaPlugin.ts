type IMediaChild = IMediaContainer | IMediaItem;

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
    [Symbol.iterator](): Iterator<IMediaChild>;
    Initialize(): Promise<void>;
    Update(): Promise<void>;
}

export abstract class MediaContainer<T extends IMediaChild> implements IMediaContainer {

    protected _items: T[];

    constructor(identifier: string, title: string, parent?: IMediaContainer) {
        this.Parent = parent;
        this.Identifier = identifier;
        this.Title = title;
        this._items = [];
    }

    public readonly Parent?: IMediaContainer;
    public readonly Identifier: string;
    public readonly Title: string;

    public *[Symbol.iterator](): Iterator<T> {
        for(const item of this._items) {
            yield item;
        }
    }

    public async Initialize(): Promise<void> {
        // NOTE: nonce method, disable after called once
        this.Initialize = () => Promise.resolve();
    }

    public abstract Update(): Promise<void>;
}

export abstract class MediaScraper {
    public abstract CreatePlugin(): MediaContainer<IMediaContainer>;
    public abstract get Identifier(): string;
    public abstract get Title(): string;
    public abstract get URI(): URL;
    //readonly Icon: Image;
    //readonly Tags: object[];
}