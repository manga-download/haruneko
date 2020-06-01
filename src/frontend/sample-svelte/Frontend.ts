import { IFrontendModule } from '../IFrontend'
import App from './App.svelte';

class SampleSvelte implements IFrontendModule {

    async Render(root: HTMLElement): Promise<void> {
        new App({ target: root, props: {} });
    }
}

export default new SampleSvelte();