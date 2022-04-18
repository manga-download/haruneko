import type { HakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

declare global {
    const HakuNeko: HakuNeko;
    interface Window {
        HakuNeko: HakuNeko;
    }
}