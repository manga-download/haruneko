import { CreateUnsupportedPlatformError, DetectPlatform, Runtime, type PlatformInfo } from './engine/Platform';
import type { IFrontendModule, IFrontendInfo } from './frontend/IFrontend';
import type { Event } from './engine/Event';

async function ShowNodeWebkitSplashScreen(nwWindow: NWJS_Helpers.win, event: Event<IFrontendModule, IFrontendInfo>, timeout: number) {

    nwWindow.hide();

    const nwSplashOptions = {
        new_instance: true,
        frame: false,
        transparent: true,
        show: true,
        position: 'center',
        width: 416,
        height: 520
    };

    const nwSplash = await new Promise<NWJS_Helpers.win>(resolve => {
        nw.Window.open(window.location.origin + '/splash.html', nwSplashOptions, (popup: NWJS_Helpers.win) => {
            popup.on('closed', () => {
                nwWindow.show();
                nwWindow.focus();
            });
            popup.focus();
            resolve(popup);
        });
    });

    const hideSplashScreen = () => {
        event.Unsubscribe(hideSplashScreen);
        clearTimeout(hideSplashScreenTimeout);
        nwSplash.close(true);
    };

    event.Subscribe(hideSplashScreen);
    const hideSplashScreenTimeout = setTimeout(hideSplashScreen, timeout);
}

async function InitializeNodeWebkit(info: PlatformInfo) {
    const { HakuNeko } = await import('./engine/HakuNeko');
    const { FrontendController } = await import('./frontend/FrontendController');

    const nwWindow = nw.Window.get();

    if(window.localStorage.getItem('hakuneko-dev-nosplash') === 'true') {
        nwWindow.show();
    } else {
        ShowNodeWebkitSplashScreen(nwWindow, FrontendController.FrontendLoaded, 7500);
    }

    nwWindow.window.HakuNeko = new HakuNeko(info);
    await window.HakuNeko.Initialze();
    new FrontendController(window.HakuNeko.SettingsManager.OpenScope());
}

async function InitializeBrowser(info: PlatformInfo) {
    const { HakuNeko } = await import('./engine/HakuNeko');
    const { FrontendController } = await import('./frontend/FrontendController');

    globalThis.window.HakuNeko = new HakuNeko(info);
    await window.HakuNeko.Initialze();
    new FrontendController(window.HakuNeko.SettingsManager.OpenScope());
}

(async function() {
    try {
        const info = DetectPlatform();
        if(info.Runtime === Runtime.NodeWebkit) {
            await InitializeNodeWebkit(info);
            return;
        }
        if([ Runtime.Chrome, Runtime.Gecko, Runtime.WebKit ].includes(info.Runtime)) {
            await InitializeBrowser(info);
            return;
        }
        throw CreateUnsupportedPlatformError(info);
    } catch(error) {
        console.error(error);
        const html = `
            <p>
                <div style="text-align: left; display: inline-block; width: 75%;">
                    <hr>
                    <h2>${error?.message}</h2>
                    <pre style="padding: 0.5em; white-space: pre-wrap; color: red; background-color: white; border: 1px solid darkgrey;">${error?.stack}</pre>
                    <hr>
                </div>
            </p>
        `
            //.replace(new RegExp(window.location.origin, 'g'), '')
            .replace(/\?t=[\d:]+/g, '')
            .trim();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => document.querySelector('#hakuneko-notice').innerHTML = html);
        } else {
            document.querySelector('#hakuneko-notice').innerHTML = html;
        }
    }
})();