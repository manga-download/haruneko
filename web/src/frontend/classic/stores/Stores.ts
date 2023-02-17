import { writable } from 'svelte/store';
import type { IWindowController } from '../../WindowController';
import { CreateWindowController } from '../../WindowController';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';

export const WindowController = writable<IWindowController>(CreateWindowController());
export const selectedPlugin = writable<IMediaContainer>();
export const selectedMedia = writable<IMediaContainer>();
export const selectedItem = writable<IMediaContainer>();
export const selectedItemPrevious = writable<IMediaContainer>();
export const selectedItemNext = writable<IMediaContainer>();
