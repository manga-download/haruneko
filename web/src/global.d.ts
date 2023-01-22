import type { HakuNeko } from './engine/HakuNeko';

declare global {
    const HakuNeko: HakuNeko;
    interface Window {
        HakuNeko: HakuNeko;
    }
}