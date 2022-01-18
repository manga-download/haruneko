import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class SampleSvelte implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        new App({ target: root, props: {} });
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleSvelte();