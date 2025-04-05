import { CreateAppWindow } from './engine/platform/AppWindow';
import { FeatureFlags } from './engine/FeatureFlags';
import type { HakuNeko } from './engine/HakuNeko';
import './engine/ArrayExtensions';
import './engine/RegExpSafe';

const appHook = '#app';
const noticeHook = '#hakuneko-notice';
const splashPath = '/splash.html';

declare global {
    var HakuNeko: HakuNeko;
    interface Window {
        HakuNeko: HakuNeko;
    }
}

window.addEventListener('load', async () => {
    const urlServiceWorker = new URL(import.meta.env.DEV ? './service-worker.ts' : './sw.js', import.meta.url);
    const registration = await navigator.serviceWorker.register(urlServiceWorker);
    registration.addEventListener('updatefound', () => {
        const activeServiceWorker = registration.active;
        // Reload application as soon as the active servcie-worker was replaced by the updated service-worker
        activeServiceWorker?.addEventListener('statechange', () => activeServiceWorker.state === 'redundant' ? window.location.reload() : null);
    });
});

function ShowErrorNotice(root: HTMLElement, error?: Error) {
    const heading = document.createElement('h2');
    heading.textContent = error?.message;

    const stacktrace = document.createElement('pre');
    stacktrace.textContent = error?.stack.replace(/\?t=[\d:]+/g, '')?.trim() ?? '';
    stacktrace.setAttribute('style', 'padding: 0.5em; white-space: pre-wrap; color: red; background-color: white; border: 1px solid darkgrey;');

    const container = document.createElement('div');
    container.setAttribute('style', 'text-align: left; display: inline-block; max-width: 80%; margin: 2em;');
    container.append(heading, stacktrace);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => root.replaceChildren(container), { once: true });
    } else {
        root.replaceChildren(container);
    }
}

(async function() {
    try {
        const appWindow = CreateAppWindow(window.location.origin + splashPath);
        if(FeatureFlags.ShowSplashScreen) {
            appWindow.ShowSplash();
        } else {
            appWindow.HideSplash();
        }

        // Use dynamic instead of static import for these large modules to improve start-up performance
        const { HakuNeko } = await import('./engine/HakuNeko');
        const { FrontendController, FrontendList } = await import('./frontend/FrontendController');

        window.HakuNeko = new HakuNeko();
        await window.HakuNeko.Initialze(FrontendList);
        if(window.HakuNeko.FeatureFlags.CrowdinTranslationMode.Value) {
            document.head.querySelector<HTMLScriptElement>('#crowdin').src = 'https://cdn.crowdin.com/jipt/jipt.js';
        }

        const frontend = new FrontendController(document.querySelector(appHook), window.HakuNeko.SettingsManager.OpenScope(), appWindow);

        if(FeatureFlags.ShowSplashScreen) {
            await Promise.race([
                new Promise<void>(resolve => frontend.CurrentFrontendInfo.Subscribe(() => resolve())),
                new Promise<void>(resolve => setTimeout(resolve, 7500)),
            ]);
            appWindow.HideSplash();
        }
    } catch(error) {
        console.error(error);
        ShowErrorNotice(document.querySelector(noticeHook), error);
    }
})();