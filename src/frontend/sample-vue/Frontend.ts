import { createApp } from 'vue';
import { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class SampleVue implements IFrontendModule {

    async Render(root: HTMLElement): Promise<void> {
        createApp(App).mount(root);
    }
}

export default new SampleVue();