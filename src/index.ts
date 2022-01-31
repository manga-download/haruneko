import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';
import { WindowController } from './engine/WindowController';

const splashOptions = {
    new_instance: true,
    frame: false,
    transparent: true,
    show: true,
    position: 'center',
    width: 415,
    height: 520
};

async function Initialize() {

    const nwWindow = nw.Window.get();
    nwWindow.hide();
    const nwSplash = await new Promise<NWJS_Helpers.win>(resolve => {
        nw.Window.open(window.location.origin + '/splash.html', splashOptions, (win: NWJS_Helpers.win) => {
            win.focus();
            resolve(win);
        });
    });

    window.HakuNeko = new HakuNeko();
    await window.HakuNeko.Initialze();
    window.HakuNeko.EventManager.FrontendLoaded.Subscribe(HideSplashScreen);
    const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
    window.Frontend = new FrontendController(new WindowController(nwWindow));

    function HideSplashScreen() {
        window.HakuNeko.EventManager.FrontendLoaded.Unsubscribe(HideSplashScreen);
        clearTimeout(timerHideSplashScreen);
        nwSplash.close();
        nwWindow.show();
        nwWindow.focus();
    }
}

if(Object.keys(window).includes('nw')) {
    Initialize();
} else {
    console.error('Cannot run HakuNeko outside of NW.js!');
}