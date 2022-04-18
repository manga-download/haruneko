import { CreateUnsupportedPlatformError, DetectPlatform, Runtime, type PlatformInfo } from './engine/Platform';

async function InitializeNodeWebkit(info: PlatformInfo) {

    const nwWindow = nw.Window.get();
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

    const { HakuNeko } = await import('./engine/HakuNeko');
    const { FrontendController } = await import('./frontend/FrontendController');

    nwWindow.window.HakuNeko = new HakuNeko(info);
    await window.HakuNeko.Initialze();
    FrontendController.FrontendLoaded.Subscribe(HideSplashScreen);
    const timerHideSplashScreen = setTimeout(HideSplashScreen, 7500);
    new FrontendController();

    function HideSplashScreen() {
        FrontendController.FrontendLoaded.Unsubscribe(HideSplashScreen);
        clearTimeout(timerHideSplashScreen);
        nwSplash.close(true);
    }
}

async function InitializeBrowser(info: PlatformInfo) {
    const { HakuNeko } = await import('./engine/HakuNeko');
    const { FrontendController } = await import('./frontend/FrontendController');

    globalThis.window.HakuNeko = new HakuNeko(info);
    await window.HakuNeko.Initialze();
    new FrontendController();
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