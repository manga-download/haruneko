import type { IAppWindow } from '../../engine/platform/AppWindow';
import type { IFrontendModule } from '../IFrontend';
import { mount } from 'svelte';
import App from './App.svelte';
import { Initialize } from './stores/Settings.svelte';
import { Store } from './stores/Stores.svelte';

class Classic implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        await Initialize();
        const app = mount(App, { target: root, props: {} });
        await app.FinishLoading;
        Store.WindowController = windowController;
    }
}

export default new Classic();