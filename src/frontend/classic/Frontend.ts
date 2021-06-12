import { IFrontendModule } from '../IFrontend'
import App from './App'

class Classic implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        new App(root);
    }
}

export default new Classic();