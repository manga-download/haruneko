import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import type { IAppWindow } from '../../../engine/platform/AppWindow';
import { Settings } from './Settings.svelte';

class UIClassicStore {
    WindowController:IAppWindow = $state();
    selectedPlugin: MediaContainer<MediaChild> = $state(HakuNeko.BookmarkPlugin);
    selectedMedia: MediaContainer<MediaChild> = $state(null);
    selectedItem: MediaContainer<MediaItem> = $state();
    selectedItemPrevious: MediaContainer<MediaItem> = $state();
    selectedItemNext: MediaContainer<MediaItem> = $state();
    contentscreen: string = $state('/');
    suggestions:Promise<Bookmark[]> = $derived( refreshSuggestions());
}
export let Store:UIClassicStore = new UIClassicStore();

async function refreshSuggestions() : Promise<Bookmark[]> {
    return Settings.checkNewContent.Value ? await HakuNeko.BookmarkPlugin.GetEntriesWithUnflaggedContent() : [];
}
