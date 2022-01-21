import type { IWindowController } from '../../engine/WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';
import { WindowController } from './Stores';

class Classic implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        const app = new App({ target: root, props: {} });
        await app.FinishLoading;
        WindowController.set(windowController);
    }
}

export default new Classic();