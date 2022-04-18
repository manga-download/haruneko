import { writable } from 'svelte/store';
import type { IWindowController } from '../WindowController';

export const WindowController = writable<IWindowController>();