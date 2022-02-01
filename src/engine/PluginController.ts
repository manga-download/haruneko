import type { IMediaContainer } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import * as websites from './websites/_index';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[];

    constructor(storageController: StorageController, settingsManager: SettingsManager) {
        this._websites = Object.values(websites).map(website => new website().CreatePlugin(storageController, settingsManager) as IMediaContainer);
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}