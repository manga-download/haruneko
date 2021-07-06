import { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class Classic implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        new App({ target: root, props: {} });
    }
}

export default new Classic();