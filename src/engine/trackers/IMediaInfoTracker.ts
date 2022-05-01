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

export interface IMediaInfoTracker {
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