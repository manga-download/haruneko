import { MediaContainer } from './MediaPlugin';
import type { TWebsite } from '../PluginController';
import { type StorageController, Store } from '../StorageController';

const FavoriteWebsitesStorageKey = 'Websites';

export class FavoritePlugin extends MediaContainer<TWebsite> {

    constructor(private readonly storage: StorageController, private readonly websites: TWebsite[]) {
        super('favorites', 'Favorites');
        this.#Load();
    }

    async #Load(): Promise<void> {
        const favorites = await this.storage.LoadPersistent<string[]>(Store.Favorites, FavoriteWebsitesStorageKey);
        this.entries.Value = this.websites.filter(plugin => favorites.includes(plugin.Identifier));
    }

    async #Save(): Promise<void> {
        const favorites = this.entries.Value.map(entry => entry.Identifier);
        return this.storage.SavePersistent<string[]>(favorites, Store.Favorites, FavoriteWebsitesStorageKey);
    }

    public Add(website: TWebsite): Promise<void> {
        if(this.IsFavorite(website)) {
            return;
        }
        this.entries.Push(website);
        return this.#Save();
    }

    public Remove(website: TWebsite): Promise<void> {
        this.entries.Value = this.entries.Value.filter(entry => entry.Identifier !== website.Identifier);
        return this.#Save();
    }

    public async Toggle(website: TWebsite): Promise<boolean> {
        if (this.IsFavorite(website)) {
            await this.Remove(website);
            return false;
        }
        else {
            await this.Add(website);
            return true;
        }
    }

    public IsFavorite(website: TWebsite): boolean {
        return this.entries.Value.some(entry => entry.Identifier === website.Identifier);
    }
}