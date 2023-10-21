import { readable, writable } from 'svelte/store';
import type { IWindowController } from '../../WindowController';
import { CreateWindowController } from '../../WindowController';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import { checkNewContent } from './Settings';

export const WindowController = writable<IWindowController>(CreateWindowController());
export const selectedPlugin = writable<IMediaContainer>();
export const selectedMedia = writable<IMediaContainer>();
export const selectedItem = writable<IMediaContainer>();
export const selectedItemPrevious = writable<IMediaContainer>();
export const selectedItemNext = writable<IMediaContainer>();

export const bookmarksToContinue = readable<Bookmark[]>([], (set) => {
    async function refreshSuggestions() {
        set(await HakuNeko.BookmarkPlugin.getEntriesWithUnflaggedContent());
    }
    refreshSuggestions();
    const unsubcribe = checkNewContent.subscribe(shouldCheck => {
        if (shouldCheck) refreshSuggestions();
    });

    return function stop() { unsubcribe; };
});
