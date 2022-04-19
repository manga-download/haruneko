import type { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleJS implements IFrontendModule {
    async Render(root: HTMLElement/*, windowController: IWindowController*/): Promise<void> {
        new App(root);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleJS();