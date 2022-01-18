import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class Classic implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        const app = new App({ target: root, props: {} });
        await app.FinishLoading;
    }
}

export default new Classic();