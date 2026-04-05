import type { MediaInfoTracker } from './trackers/IMediaInfoTracker';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
import * as mocks from './websites/_mocks_/_index';
import * as websites from './websites/_index';
import { Kitsu } from './trackers/Kitsu';
import { FavoritePlugin } from './providers/FavoritePlugin';
import { BookmarkPlugin } from './providers/BookmarkPlugin';

export type TWebsite = MediaContainer<MediaContainer<MediaChild>>;

export class PluginController {

    readonly #websites: TWebsite[];
    readonly #trackers: MediaInfoTracker[];
    readonly #favorites: FavoritePlugin;
    readonly #bookmarks: BookmarkPlugin;

    constructor(storageController: StorageController, settingsManager: SettingsManager) {
        this.#trackers = [
            new Kitsu(settingsManager)
        ];
        this.#websites = [
            ... globalThis?.location?.hostname === 'localhost' ? Object.values(mocks).map(website => new website().CreatePlugin(storageController, settingsManager)) : [],
            ... Object.values(websites).map(website => new website().CreatePlugin(storageController, settingsManager)),
        ];
        this.#favorites = new FavoritePlugin(storageController, this.#websites);
        this.#bookmarks = new BookmarkPlugin(storageController, this, new InteractiveFileContentProvider());
    }

    public get WebsitePlugins(): ReadonlyArray<TWebsite> {
        return this.#websites;
    }

    public get InfoTrackers(): ReadonlyArray<MediaInfoTracker> {
        return this.#trackers;
    }

    /**
     * Plugin for managing favorite websites.
     */
    public get Favorites(): FavoritePlugin {
        return this.#favorites;
    }


}