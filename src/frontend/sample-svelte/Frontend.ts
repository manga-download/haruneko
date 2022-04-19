import type { IFrontendModule } from '../IFrontend';
import App from './App.svelte';

class SampleSvelte implements IFrontendModule {
    async Render(root: HTMLElement/*, windowController: IWindowController*/): Promise<void> {
        new App({ target: root, props: {} });
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleSvelte();