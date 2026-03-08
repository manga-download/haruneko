import { readable, writable, get } from 'svelte/store';
import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import { checkNewContent } from './Settings';
import type { IAppWindow } from '../../../engine/platform/AppWindow';

const FavoritesStorageKey = 'PluginFavorites';

function loadFavorites(): string[] {
    try {
        return JSON.parse(localStorage.getItem(FavoritesStorageKey) || '[]');
    } catch {
        return [];
    }
}

function saveFavorites(favorites: string[]): void {
    localStorage.setItem(FavoritesStorageKey, JSON.stringify(favorites));
}

export const pluginFavorites = writable<string[]>(loadFavorites());
pluginFavorites.subscribe(saveFavorites);

export function togglePluginFavorite(identifier: string): void {
    const current = get(pluginFavorites);
    if (current.includes(identifier)) {
        pluginFavorites.set(current.filter(id => id !== identifier));
    } else {
        pluginFavorites.set([...current, identifier]);
    }
}

export const WindowController = writable<IAppWindow>(null);
export const selectedPlugin = writable<MediaContainer<MediaChild>>(HakuNeko.BookmarkPlugin);
export const selectedMedia = writable<MediaContainer<MediaChild>>();
export const selectedItem = writable<MediaContainer<MediaItem>>();
export const selectedItemPrevious = writable<MediaContainer<MediaItem>>();
export const selectedItemNext = writable<MediaContainer<MediaItem>>();
export const contentscreen = writable<string>('/');

export const bookmarksToContinue = readable<Bookmark[]>([], (set) => {
    async function refreshSuggestions() {
        set(await HakuNeko.BookmarkPlugin.GetEntriesWithUnflaggedContent());
    }
    refreshSuggestions();
    const unsubcribe = checkNewContent.subscribe(shouldCheck => {
        if (shouldCheck) refreshSuggestions();
    });

    return function stop() { unsubcribe; };
});