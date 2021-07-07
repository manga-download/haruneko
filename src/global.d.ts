import { IHakuNeko } from './engine/HakuNeko';
import { IFrontendController } from './frontend/FrontendController';

declare global {
    const nw: any;
    const HakuNeko: IHakuNeko;
    const Frontend: IFrontendController;
    interface Window {
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
    }
}