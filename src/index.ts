import { Initialize as InitBlacklist } from './engine/Blacklist';
import { Initialize as InitFetchProvider } from './engine/FetchProvider';
import { HakuNeko } from './engine/HakuNeko';
import { FrontendController } from './frontend/FrontendController';

const nwWindow = Object.keys(window).includes('nw') ? nw.Window.get() : undefined;
let nwSplash:any = undefined;

nw.Window.open(window.location.origin+'/splash.html',
    {
        new_instance: true,
        frame: false,
        transparent: true,
        show: true,
        position: 'center',
        width: 415,
        height: 520
    },
    function(new_win:any) {
        nwSplash=new_win;
        new_win.focus();
    }
);
const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
window.addEventListener('appready', HideSplashScreen);

if(nwWindow) {
    InitBlacklist();
    InitFetchProvider();
    window.HakuNeko = new HakuNeko();
    window.Frontend = new FrontendController();
}
function HideSplashScreen() {
    clearTimeout(timerHideSplashScreen);
    nwSplash.close();
    nwWindow.show();
    nwWindow.focus();
}