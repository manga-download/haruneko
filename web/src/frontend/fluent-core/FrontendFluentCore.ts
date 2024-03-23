import { provideFluentDesignSystem, allComponents as allFluentComponents } from '@fluentui/web-components';
provideFluentDesignSystem().withShadowRootMode('closed').register(allFluentComponents);
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ //=> Import necessary to register web-components
import * as _ from './components/_index';
import { createWindowService } from './services/WindowService';
import type { IFrontendModule } from '../IFrontend';
import App from './App';
import type { IAppWindow } from '../../engine/platform/AppWindow';

class FluentCore implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        provideFluentDesignSystem().register(createWindowService(windowController));
        root.appendChild(new App());
    }
}

export default new FluentCore();