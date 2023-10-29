import { DetectPlatform, type PlatformInfo } from './Platform';
import { Initialize as InitBlockList } from './BlockList';
import { Initialize as InitFetchProvider } from './FetchProvider';
import { Initialize as InitGlobalSettings } from './SettingsGlobal';
import { Tags } from './Tags';
import { PluginController } from './PluginController';
import { BookmarkPlugin } from './providers/BookmarkPlugin';
import { ItemflagManager } from './ItemflagManager';
import { CreateStorageController, type StorageController } from './StorageController';
import { InteractiveFileContentProvider } from './InteractiveFileContentProvider';
import { SettingsManager } from './SettingsManager';
import { CreatePlatformIPC } from './ipc/InterProcessCommunicationFactory';
import { DownloadManager } from './DownloadManager';
import { Key as GlobalKey } from './SettingsGlobal';
import type { Check } from './SettingsManager';
export class HakuNeko {

    readonly #storageController: StorageController;
    readonly #settingsManager: SettingsManager;
    readonly #pluginController: PluginController;
    readonly #bookmarkPlugin: BookmarkPlugin;
    readonly #itemflagManager: ItemflagManager;
    readonly #downloadManager: DownloadManager;

    constructor(info?: PlatformInfo) {
        info = info ?? DetectPlatform();
        InitBlockList(info);
        InitFetchProvider(info);
        this.#storageController = CreateStorageController(info);
        this.#settingsManager = new SettingsManager(this.#storageController);
        this.#pluginController = new PluginController(this.#storageController, this.#settingsManager);
        this.#bookmarkPlugin = new BookmarkPlugin(this.#storageController, this.#pluginController, new InteractiveFileContentProvider());
        this.#itemflagManager = new ItemflagManager(this.#storageController);
        this.#downloadManager = new DownloadManager(this.#storageController);
    }

    public async Initialze(): Promise<void> {
        await InitGlobalSettings(this.SettingsManager);
        /*const ipc = */CreatePlatformIPC(this.#settingsManager);
        if (this.SettingsManager.OpenScope().Get<Check>(GlobalKey.CheckNewContent).Value) {
            this.BookmarkPlugin.UpdateEntries().forEach(promise => promise.then(bookmark => this.ItemflagManager.MediaFlagsChanged.Dispatch(null, bookmark)));
        }
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

    public get ItemflagManager(): ItemflagManager {
        return this.#itemflagManager;
    }

    public get DownloadManager(): DownloadManager {
        return this.#downloadManager;
    }
}