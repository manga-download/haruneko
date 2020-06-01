import { IFrontendModule } from '../IFrontend'
import App from './App'

class SampleJS implements IFrontendModule {

    async Render(root: HTMLElement): Promise<void> {
        new App(root);
    }
}

export default new SampleJS();