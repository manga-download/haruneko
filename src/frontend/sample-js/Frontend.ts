import { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleJS implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        new App(root);
        setTimeout(function () {
            window.dispatchEvent(new Event('appready'));
        }, 2500);
    }
}

export default new SampleJS();