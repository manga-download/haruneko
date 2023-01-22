import { provideFluentDesignSystem, allComponents as allFluentComponents } from '@fluentui/web-components';
provideFluentDesignSystem().withShadowRootMode('closed').register(allFluentComponents);
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ //=> Import necessary to register web-components
import * as _ from './components/_index';
import type { IWindowController } from '../WindowController';
import { createWindowService } from './services/WindowService';
import type { IFrontendModule } from '../IFrontend';
import App from './App';

class FluentCore implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        provideFluentDesignSystem().register(createWindowService(windowController));
        root.appendChild(new App());
    }
}

export default new FluentCore();