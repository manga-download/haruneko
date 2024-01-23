import { CreateAppWindow } from './engine/platform/AppWindow';

const appHook = '#app';
const noticeHook = '#hakuneko-notice';
const splashPath = '/splash.html';

function showErrorNotice(root: HTMLElement, error?: Error) {
    function format(text?: string): string {
        const div = document.createElement('div');
        //.replace(new RegExp(window.location.origin, 'g'), '')
        div.textContent = text?.replace(/\?t=[\d:]+/g, '')?.trim() ?? '';
        return div.innerHTML;
    }
    const message = format(error?.message);
    const stack = format(error?.stack);
    const html = `
        <p>
            <div style="text-align: left; display: inline-block; width: 75%;">
                <hr>
                <h2>${message}</h2>
                <pre style="padding: 0.5em; white-space: pre-wrap; color: red; background-color: white; border: 1px solid darkgrey;">${stack}</pre>
                <hr>
            </div>
        </p>
    `;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => root.innerHTML = html);
    } else {
        root.innerHTML = html;
    }
}

(async function() {
    try {
        const showSplashScreen = window.localStorage.getItem('hakuneko-nosplash') !== 'true';
        const appWindow = CreateAppWindow(window.location.origin + splashPath, showSplashScreen);
        if(showSplashScreen) {
            appWindow.ShowSplash();
        }

        // Use lazy loading for these large modules to improve start-up performance
        const { HakuNeko } = await import('./engine/HakuNeko');
        const { FrontendController } = await import('./frontend/FrontendController');

        window.HakuNeko = new HakuNeko();
        await window.HakuNeko.Initialze();
        const frontend = new FrontendController(document.querySelector(appHook), window.HakuNeko.SettingsManager.OpenScope(), appWindow);

        if(showSplashScreen) {
            await Promise.race([
                new Promise<void>(resolve => setTimeout(resolve, 7500)),
                new Promise<void>(resolve => frontend.FrontendLoaded.Subscribe(() => resolve())),
            ]);
            appWindow.HideSplash();
        }
    } catch(error) {
        console.error(error);
        showErrorNotice(document.querySelector(noticeHook), error);
    }
})();