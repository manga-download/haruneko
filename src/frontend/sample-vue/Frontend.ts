import { createApp } from 'vue';
import { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class SampleVue implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        createApp(App).mount(root);
        setTimeout(function () {
            window.dispatchEvent(new Event('appready'));
        }, 2500);
    }
}

export default new SampleVue();