import { createApp } from 'vue';
import { IFrontendModule } from '../IFrontend';
import App from './App.vue';

class Playground implements IFrontendModule {

    async Render(root: Element): Promise<void> {
        // artificial delay to make loading screen visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        createApp(App).mount(root);
    }
}

export default new Playground();