import Playground from './playground/Playground.js';
import { IHakuNeko, HakuNeko } from './engine/HakuNeko.js';
import { IFrontendController, FrontendController } from './frontend/FrontendController.js';

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

window.Playground = Playground;
window.HakuNeko = new HakuNeko();
window.Frontend = new FrontendController();