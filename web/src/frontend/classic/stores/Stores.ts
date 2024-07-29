import { readable, writable } from 'svelte/store';
import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import type { DownloadTask } from '../../../engine/DownloadTask';
import { checkNewContent } from './Settings';
import type { IAppWindow } from '../../../engine/platform/AppWindow';

export const WindowController = writable<IAppWindow>(null);
export const selectedPlugin = writable<MediaContainer<MediaContainer<MediaChild>>>();
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

export const DownloadTasks = readable<DownloadTask[]>([], (set) => {

    function OnTasksChangedCallback() {
        set(HakuNeko.DownloadManager.Queue.Value);
    }

    set(HakuNeko.DownloadManager.Queue.Value);
    HakuNeko.DownloadManager.Queue.Subscribe(OnTasksChangedCallback);

    return () => {
        HakuNeko.DownloadManager.Queue.Unsubscribe(OnTasksChangedCallback);
    };
});