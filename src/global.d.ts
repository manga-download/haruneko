import type { HakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

declare global {
    const nw: any;
    const HakuNeko: HakuNeko;
    const Frontend: IFrontendController;
    interface Window {
        HakuNeko: HakuNeko;
        Frontend: IFrontendController;
    }
}