import { IHakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

declare global {
    const nw: any;
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
    }
}