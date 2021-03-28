import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

//const gui = require('nw.gui');
//gui.Window.get().
nw.Window.get().showDevTools();

window.HakuNeko = new HakuNeko();
window.Frontend = new FrontendController();