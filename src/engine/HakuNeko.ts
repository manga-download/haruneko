import { DetectPlatform, type PlatformInfo } from './Platform';
import { Initialize as InitBlockList } from './BlockList';
import { Initialize as InitFetchProvider } from './FetchProvider';
import { Initialize as InitGlobalSettings } from './SettingsGlobal';
import { Tags } from './Tags';
import { PluginController } from './PluginController';
import { BookmarkPlugin } from './providers/BookmarkPlugin';
import { ItemmarkManager } from './ItemmarkManager';
import { CreateStorageController, type StorageController } from './StorageController';
import { SettingsManager } from './SettingsManager';
import { DownloadManager } from './DownloadManager';

export class HakuNeko {

    readonly #storageController: StorageController;
    readonly #settingsManager: SettingsManager;
    readonly #pluginController: PluginController;
    readonly #bookmarkPlugin: BookmarkPlugin;
    readonly #itemmarkManager: ItemmarkManager;
    readonly #downloadManager: DownloadManager;

    constructor(info?: PlatformInfo) {
        info = info ?? DetectPlatform();
        InitBlockList(info);
        InitFetchProvider(info);
        this.#storageController = CreateStorageController(info);
        this.#settingsManager = new SettingsManager(this.#storageController);
        this.#pluginController = new PluginController(this.#storageController, this.#settingsManager);
        this.#bookmarkPlugin = new BookmarkPlugin(this.#storageController, this.#pluginController);
        this.#itemmarkManager = new ItemmarkManager(this.#storageController);
        this.#downloadManager = new DownloadManager(this.#storageController);
    }

    public async Initialze(): Promise<void> {
        await InitGlobalSettings(this.SettingsManager);
    }

    public get Tags() {
        return Tags;
    }

    public get PluginController(): PluginController {
        return this.#pluginController;
    }

    public get SettingsManager(): SettingsManager {
        return this.#settingsManager;
    }

    public get BookmarkPlugin(): BookmarkPlugin {
        return this.#bookmarkPlugin;
    }

    public get ItemmarkManager(): ItemmarkManager {
        return this.#itemmarkManager;
    }
    public get DownloadManager(): DownloadManager {
        return this.#downloadManager;
    }
}