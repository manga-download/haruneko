import type { MediaInfoTracker } from './trackers/IMediaInfoTracker';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import { type StorageController, Store } from './StorageController';
import { Observable } from './Observable';
import * as mocks from './websites/_mocks_/_index';
import * as websites from './websites/_index';
import { Kitsu } from './trackers/Kitsu';

type TWebsite = MediaContainer<MediaContainer<MediaChild>>;

export class PluginController {

    private readonly _websites: TWebsite[];
    private readonly _trackers: MediaInfoTracker[];
    private readonly _favorites: Observable<string[]> = new Observable<string[]>([]);

    constructor(private readonly storageController: StorageController, settingsManager: SettingsManager) {
        this._trackers = [
            new Kitsu(settingsManager)
        ];
        this._websites = [
            ... globalThis?.location?.hostname === 'localhost' ? Object.values(mocks).map(website => new website().CreatePlugin(storageController, settingsManager)) : [],
            ... Object.values(websites).map(website => new website().CreatePlugin(storageController, settingsManager)),
        ];
        this.LoadFavorites();
    }

    private async LoadFavorites(): Promise<void> {
        const stored = await this.storageController.LoadPersistent<string[]>(Store.PluginFavorites);
        if (Array.isArray(stored)) {
            this._favorites.Value = stored;
        }
    }

    public get WebsitePlugins(): ReadonlyArray<TWebsite> {
        return this._websites;
    }

    public get InfoTrackers(): ReadonlyArray<MediaInfoTracker> {
        return this._trackers;
    }

    public get Favorites(): Observable<string[]> {
        return this._favorites;
    }

    public IsFavorite(identifier: string): boolean {
        return this._favorites.Value.includes(identifier);
    }

    public async ToggleFavorite(identifier: string): Promise<void> {
        const current = this._favorites.Value;
        if (current.includes(identifier)) {
            this._favorites.Value = current.filter(id => id !== identifier);
        } else {
            this._favorites.Value = [...current, identifier];
        }
        await this.storageController.SavePersistent(this._favorites.Value, Store.PluginFavorites);
    }
}
