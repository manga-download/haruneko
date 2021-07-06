import { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class SampleSvelte implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        new App({ target: root, props: {} });
        setTimeout(function () {
            window.dispatchEvent(new Event('appready'));
        }, 2500);
    }
}

export default new SampleSvelte();