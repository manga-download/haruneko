import type { IMediaInfoTracker } from './providers/IMediaInfoTracker';
import type { IMediaContainer, MediaScraper } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import * as websites from './websites/_index';
import { Kitsu } from './trackers/Kitsu';

export interface IPluginController {
    readonly WebsitePlugins: IMediaContainer[];
    readonly InfoTrackers: IMediaInfoTracker[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[];
    private readonly _trackers: IMediaInfoTracker[];

    constructor(storageController: StorageController, settingsManager: SettingsManager) {
        this._trackers = [
            new Kitsu(settingsManager)
        ];
        this._websites = Object.values(websites).map((website: new() => unknown) => (new website() as MediaScraper<IMediaContainer>).CreatePlugin(storageController, settingsManager) as IMediaContainer);
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }

    public get InfoTrackers(): IMediaInfoTracker[] {
        return this._trackers;
    }
}