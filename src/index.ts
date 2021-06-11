import { Initialize as InitBlacklist } from './engine/Blacklist';
import { Initialize as InitFetchProvider } from './engine/FetchProvider';
import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
window.addEventListener('appready', HideSplashScreen);

if(nw) {
    //const gui = require('nw.gui');
    //gui.Window.get().
    const win = nw.Window.get();
    win.show();
    InitializeWindowMenu(/*win*/);
    InitBlacklist();
    InitFetchProvider();
    window.HakuNeko = new HakuNeko();
    window.Frontend = new FrontendController();
}

function InitializeWindowMenu(/*win*/) {
    /*
    const menu = new nw.Menu({type: 'menubar'});
    const submenu = new nw.Menu();
    submenu.append(new nw.MenuItem({ label: 'Quit' }));
    menu.append(new nw.MenuItem({
        label: 'HakuNeko',
        submenu: submenu
    }));
    win.menu = menu;
    */
}

function HideSplashScreen() {
    clearTimeout(timerHideSplashScreen);
    document.querySelector('#splash')?.remove();
    (document.querySelector('#app') as HTMLDivElement).style.display = 'initial';
}