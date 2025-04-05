import type { MediaInfoTracker } from './trackers/IMediaInfoTracker';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import * as mocks from './websites/_mocks_/_index';
import * as websites from './websites/_index';
import { Kitsu } from './trackers/Kitsu';

type TWebsite = MediaContainer<MediaContainer<MediaChild>>;

export class PluginController {

    private readonly _websites: TWebsite[];
    private readonly _trackers: MediaInfoTracker[];

    constructor(storageController: StorageController, settingsManager: SettingsManager) {
        this._trackers = [
            new Kitsu(settingsManager)
        ];
        this._websites = [
            ... globalThis?.location?.hostname === 'localhost' ? Object.values(mocks).map(website => new website().CreatePlugin(storageController, settingsManager)) : [],
            ... Object.values(websites).map(website => new website().CreatePlugin(storageController, settingsManager)),
        ];
    }

    public get WebsitePlugins(): ReadonlyArray<TWebsite> {
        return this._websites;
    }

    public get InfoTrackers(): ReadonlyArray<MediaInfoTracker> {
        return this._trackers;
    }
}