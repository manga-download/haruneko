import type { IAppWindow } from '../../engine/platform/AppWindow';
import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';
import { Initialize } from './stores/Settings';
import { WindowController } from './stores/Stores';

class Classic implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        await Initialize();
        const app = new App({ target: root, props: {} });
        await app.FinishLoading;
        WindowController.set(windowController);
    }
}

export default new Classic();