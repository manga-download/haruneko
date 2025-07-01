import { App } from './components/_index'; // Import also registers the web-components
import { RegisterWindowManager } from './services/WindowManagerService';
import type { IFrontendModule } from '../IFrontend';
import type { IAppWindow } from '../../engine/platform/AppWindow';

class FluentCore implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        RegisterWindowManager(windowController);
        root.appendChild(new App());
    }
}

export default new FluentCore();