import { Tags } from './Tags';
import { EventManager } from './EventManager';
import { PluginController } from './PluginController';
import { BookmarkPlugin } from './providers/BookmarkPlugin';
import { StorageController } from './StorageController';
import { SettingsManager } from './SettingsManager';

export class HakuNeko {

    private readonly _storageController: StorageController = new StorageController();
    private readonly _eventManager: EventManager = new EventManager();
    private readonly _pluginController: PluginController = new PluginController();
    private readonly _settingsManager: SettingsManager = new SettingsManager(this._storageController);
    private readonly _bookmarkPlugin: BookmarkPlugin = new BookmarkPlugin(this._storageController, this._pluginController);

    public get Tags() {
        return Tags;
    }

    public get EventManager(): EventManager {
        return this._eventManager;
    }

    public get PluginController(): PluginController {
        return this._pluginController;
    }

    public get SettingsManager(): SettingsManager {
        return this._settingsManager;
    }

    public get BookmarkPlugin(): BookmarkPlugin {
        return this._bookmarkPlugin;
    }
}