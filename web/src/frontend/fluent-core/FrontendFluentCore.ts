import { App } from './components/_index'; // Import also registers the web-components
import { registerWindowManagerService } from './services/WindowManagerService';
import type { IFrontendModule } from '../IFrontend';
import type { IAppWindow } from '../../engine/platform/AppWindow';

class FluentCore implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        registerWindowManagerService(windowController);
        root.appendChild(new App());
    }
}

export default new FluentCore();