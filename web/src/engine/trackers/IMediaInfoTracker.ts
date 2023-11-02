import { NotImplementedError } from '../Error';
import type { ISettings } from '../SettingsManager';

export const enum MediaType {
    Manga = 'manga',
    Anime = 'anime',
    Novel = 'novel',
}

export const enum ReleaseStatus {
    TBA,
    Ongoing,
    Completed,
}

export const enum TrackingStatus {
    None,
    Wanted,
    Started,
    Completed,
}

export type Suggestion = {
    readonly Identifier: string;
    readonly Type: MediaType;
    readonly Title: string;
    readonly Titles: string[];
}

export type Info = Suggestion & {
    Cover: string;
    Creator: string;
    Released: Date;
    Description: string;
}

export interface MediaInfoTracker {
    readonly Identifier: string;
    readonly Title: string;
    readonly Icon: string;
    readonly Settings: ISettings;
    Login(): Promise<boolean>;
    Search(title: string): Promise<Suggestion[]>;
    GetInfo(identifier: string): Promise<Info>;
    GetStatus(identifier: string): Promise<TrackingStatus>;
    SetStatus(identifier: string, status: TrackingStatus): Promise<void>;
}

export class MissingInfoTracker implements MediaInfoTracker {
    public readonly Title: string;
    public readonly Icon: string = null;
    public readonly Settings: ISettings = null;

    constructor(public readonly Identifier: string) {
        this.Title = Identifier;
    }

    Login(): Promise<boolean> {
        throw new NotImplementedError();
    }

    Search(_title: string): Promise<Suggestion[]> {
        throw new NotImplementedError();
    }

    GetInfo(_identifier: string): Promise<Info> {
        throw new NotImplementedError();
    }

    GetStatus(_identifier: string): Promise<TrackingStatus> {
        throw new NotImplementedError();
    }

    SetStatus(_identifier: string, _status: TrackingStatus): Promise<void> {
        throw new NotImplementedError();
    }
}