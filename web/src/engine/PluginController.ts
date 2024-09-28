import type { MediaInfoTracker } from './trackers/IMediaInfoTracker';
import type { MediaScraper, MediaContainer, MediaChild } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import * as websites from './websites/_index';
import { Kitsu } from './trackers/Kitsu';

export class PluginController {

    private readonly _websites: MediaContainer<MediaContainer<MediaChild>>[];
    private readonly _trackers: MediaInfoTracker[];

    constructor(storageController: StorageController, settingsManager: SettingsManager) {
        this._trackers = [
            new Kitsu(settingsManager)
        ];
        this._websites = Object.values(websites).map((website: new() => unknown) => (new website() as MediaScraper<MediaContainer<MediaContainer<MediaChild>>>).CreatePlugin(storageController, settingsManager));
    }

    public get WebsitePlugins(): ReadonlyArray<MediaContainer<MediaContainer<MediaChild>>> {
        return this._websites;
    }

    public get InfoTrackers(): ReadonlyArray<MediaInfoTracker> {
        return this._trackers;
    }
}