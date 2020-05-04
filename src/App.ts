import { IHakuNeko, HakuNeko } from './engine/HakuNeko';
import { IFrontendController, FrontendController } from './frontend/FrontendController';

declare global {
    interface Window {
        Playground: any;
        HakuNeko: IHakuNeko;
        Frontend: IFrontendController;
    }
    const nw: any
}

//const gui = require('nw.gui');
//gui.Window.get().
nw.Window.get().showDevTools();

window.HakuNeko = new HakuNeko();
window.Frontend = new FrontendController();