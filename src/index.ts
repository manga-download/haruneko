import { Initialize as InitBlacklist } from './engine/Blacklist';
import { Initialize as InitFetchProvider } from './engine/FetchProvider';
import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

const splashOptions = {
    new_instance: true,
    frame: false,
    transparent: true,
    show: true,
    position: 'center',
    width: 415,
    height: 520
};

async function Initialze() {

    const nwWindow = nw.Window.get();
    nwWindow.hide();
    const nwSplash = await new Promise<any>(resolve => {
        nw.Window.open(window.location.origin + '/splash.html', splashOptions, (win: any) => {
            win.focus();
            resolve(win);
        });
    });

    const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
    window.addEventListener('appready', HideSplashScreen);

    function HideSplashScreen() {
        clearTimeout(timerHideSplashScreen);
        nwSplash.close();
        nwWindow.show();
        nwWindow.focus();
    }

    InitBlacklist();
    InitFetchProvider();
    window.HakuNeko = new HakuNeko();
    window.Frontend = new FrontendController();
}

if(Object.keys(window).includes('nw')) {
    Initialze();
} else {
    console.error('Cannot run HakuNeko outside of NW.js!');
}