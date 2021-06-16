import { Initialize as InitBlacklist } from './engine/Blacklist';
import { Initialize as InitFetchProvider } from './engine/FetchProvider';
import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

const nwWindow = Object.keys(window).includes('nw') ? nw.Window.get() : undefined;
const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
window.addEventListener('appready', HideSplashScreen);

if(nwWindow) {
    AdjustWindowSize(720, 480);
    nwWindow.show();
    InitBlacklist();
    InitFetchProvider();
    window.HakuNeko = new HakuNeko();
    window.Frontend = new FrontendController();
}

function AdjustWindowSize(width: number, height: number) {
    if(nwWindow) {
        nwWindow.width = Math.round(width);
        nwWindow.height = Math.round(height);
        const left = (screen.width - nwWindow.width) / 2;
        const top = (screen.height - nwWindow.height) / 2;
        nwWindow.moveTo(Math.round(left), Math.round(top));
    }
}

function HideSplashScreen() {
    clearTimeout(timerHideSplashScreen);
    document.querySelector('#splash')?.remove();
    (document.querySelector('#app') as HTMLDivElement).style.display = 'initial';
    // TODO: may set window based on last stored position and size
    AdjustWindowSize(0.80 * screen.width, 0.80 * screen.height);
}