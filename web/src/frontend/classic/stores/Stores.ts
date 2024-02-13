import { readable, writable } from 'svelte/store';
import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import type { DownloadTask } from '../../../engine/DownloadTask';
import { checkNewContent } from './Settings';
import type { IAppWindow } from '../../../engine/platform/AppWindow';
import { FlagType } from '../../../engine/ItemflagManager';

export const WindowController = writable<IAppWindow>(null);
export const selectedPlugin = writable<MediaContainer<MediaContainer<MediaChild>>>();
export const selectedMedia = writable<MediaContainer<MediaChild>>();
export const selectedItem = writable<MediaContainer<MediaItem>>();
export const selectedItemPrevious = writable<MediaContainer<MediaItem>>();
export const selectedItemNext = writable<MediaContainer<MediaItem>>();
export const contentscreen = writable<string>('/');

export const bookmarksToContinue = readable<Bookmark[]>([], (set) => {
    async function refreshSuggestions() {
        const accumulator: Bookmark[] = [];
        for(const bookmark of HakuNeko.BookmarkPlugin.Entries) {
            if((await HakuNeko.ItemflagManager.FilterEntries(bookmark as MediaContainer<MediaContainer<MediaItem>>, FlagType.None)).length > 0) {
                accumulator.push(bookmark);
            }
        }
        set(accumulator);
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
