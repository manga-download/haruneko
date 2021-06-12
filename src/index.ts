import { Initialize as InitBlacklist } from './engine/Blacklist';
import { Initialize as InitFetchProvider } from './engine/FetchProvider';
import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
window.addEventListener('appready', HideSplashScreen);

if(Object.keys(window).includes('nw')) {
    const win = nw.Window.get();
    win.show();
    InitBlacklist();
    InitFetchProvider();
    window.HakuNeko = new HakuNeko();
    window.Frontend = new FrontendController();
}

function HideSplashScreen() {
    clearTimeout(timerHideSplashScreen);
    document.querySelector('#splash')?.remove();
    (document.querySelector('#app') as HTMLDivElement).style.display = 'initial';
}