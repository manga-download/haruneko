import { writable } from 'svelte/store';
import type { IWindowController } from '../../WindowController';
import { CreateWindowController } from '../../WindowController';
import type { MediaContainer, MediaChild, MediaItem } from '../../../engine/providers/MediaPlugin';

export const WindowController = writable<IWindowController>(CreateWindowController());
export const selectedPlugin = writable<MediaContainer<MediaContainer<MediaChild>>>();
export const selectedMedia = writable<MediaContainer<MediaChild>>();
export const selectedItem = writable<MediaContainer<MediaItem>>();
export const selectedItemPrevious = writable<MediaContainer<MediaItem>>();
export const selectedItemNext = writable<MediaContainer<MediaItem>>();