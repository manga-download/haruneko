import { provideFluentDesignSystem, allComponents as allFluentComponents } from '@fluentui/web-components';
provideFluentDesignSystem().withShadowRootMode('closed').register(allFluentComponents);
import { App } from './components/_index'; // Import also registers the web-components
import { createWindowService } from './services/WindowService';
import type { IFrontendModule } from '../IFrontend';
import type { IAppWindow } from '../../engine/platform/AppWindow';

class FluentCore implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        provideFluentDesignSystem().register(createWindowService(windowController));
        root.appendChild(new App());
    }
}

export default new FluentCore();