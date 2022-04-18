import { createApp } from 'vue';
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class SampleVue implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        createApp(App).mount(root);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleVue();