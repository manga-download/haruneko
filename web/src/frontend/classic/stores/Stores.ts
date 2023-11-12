import { readable, writable } from 'svelte/store';
import type { IWindowController } from '../../WindowController';
import { CreateWindowController } from '../../WindowController';
import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import type { DownloadTask } from '../../../engine/DownloadTask';
import { checkNewContent } from './Settings';

export const WindowController = writable<IWindowController>(CreateWindowController());
export const selectedPlugin = writable<MediaContainer<MediaContainer<MediaChild>>>();
export const selectedMedia = writable<MediaContainer<MediaChild>>();
export const selectedItem = writable<MediaContainer<MediaItem>>();
export const selectedItemPrevious = writable<MediaContainer<MediaItem>>();
export const selectedItemNext = writable<MediaContainer<MediaItem>>();

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

export const DownloadTasks = readable<DownloadTask[]>([], (set) => {
    HakuNeko.DownloadManager.GetTasks().then((tasks) => set(tasks));

    async function OnTasksChangedCallback() {
        set(await HakuNeko.DownloadManager.GetTasks());
    }
    HakuNeko.DownloadManager.TasksAdded.Subscribe(OnTasksChangedCallback);
    HakuNeko.DownloadManager.TasksRemoved.Subscribe(OnTasksChangedCallback);

    return () => {
        HakuNeko.DownloadManager.TasksAdded.Unsubscribe(OnTasksChangedCallback);
        HakuNeko.DownloadManager.TasksRemoved.Unsubscribe(OnTasksChangedCallback);
    };

});