import { writable } from 'svelte/store';
import type { IWindowController } from '../../engine/WindowController';

export const WindowController = writable<IWindowController>();