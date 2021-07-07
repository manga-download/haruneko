import { createApp } from 'vue';
import { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class SampleVue implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        createApp(App).mount(root);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleVue();