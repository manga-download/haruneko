export interface IMedia {
    readonly Parent: IMediaContainer | null;
}

export class Media implements IMedia {

    private readonly _parent: IMediaContainer | null;

    public constructor(parent: IMediaContainer | null) {
        this._parent = parent;
    }

    public get Parent(): IMediaContainer | null {
        return this._parent;
    }
}

export interface IMediaContainer {
    readonly Identifier: string | number;
    readonly Title: string;
    readonly Language: string | null;
    readonly Parent: IMediaContainer | null;
}

export class MediaContainer implements IMediaContainer {

    private readonly _identifier: string;
    private readonly _title: string;
    private readonly _language: string | null;
    private readonly _parent: IMediaContainer | null;

    public constructor(identifier: string, title: string, language: string | null, parent: IMediaContainer | null) {
        this._identifier = identifier;
        this._title = title;
        this._language = language;
        this._parent = parent;
    }

    public get Identifier(): string {
        return this._identifier;
    }

    public get Title(): string {
        return this._title;
    }

    public get Language(): string {
        return this._language || '';
    }

    public get Parent(): IMediaContainer | null {
        return this._parent;
    }
}