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
import { CreateBloadGuard } from './platform/BloatGuard';
import { CreateFetchProvider, SetupFetchProviderExports } from './platform/FetchProvider';

export class HakuNeko {

    readonly #storageController: StorageController;
    readonly #settingsManager: SettingsManager;
    readonly #pluginController: PluginController;
    readonly #bookmarkPlugin: BookmarkPlugin;
    readonly #itemflagManager: ItemflagManager;
    readonly #downloadManager: DownloadManager;

    constructor() {
        CreateBloadGuard().Initialize();
        SetupFetchProviderExports(CreateFetchProvider());
        this.#storageController = CreateStorageController();
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
            // WORKAROUND: Manually triggering `MediaFlagsChanged` is necessary for Frontend.Classic to get notified, because it does not observe the `Entries` for each bookmark
            this.BookmarkPlugin.UpdateEntries().forEach(promise => promise.then(bookmark => this.ItemflagManager.MediaFlagsChanged.Dispatch(null, bookmark), () => {}));
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