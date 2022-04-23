import type { ISettings } from '../SettingsManager';

export const enum ReleaseStatus {
    TBA,
    Ongoing,
    Completed,
}

export const enum TrackingStatus {
    None,
    Wanted,
    Started,
    Completed
}

export type Suggestion = {
    Identifier: string;
    Title: string;
    Titles: string[];
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
    Search(title: string): Suggestion[];
    GetInfo(identifier: string): Promise<Info>;
    GetStatus(identifier: string): Promise<TrackingStatus>;
    SetStatus(identifier: string, status: TrackingStatus): Promise<void>;
}