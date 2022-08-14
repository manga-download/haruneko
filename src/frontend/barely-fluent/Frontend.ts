import { provideFluentDesignSystem, allComponents as allFluentComponents } from '@fluentui/web-components';
provideFluentDesignSystem().withShadowRootMode('closed').register(allFluentComponents);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import all from './components/_index';
import type { IWindowController } from '../WindowController';
import type { IFrontendModule } from '../IFrontend';
import App from './App';

class BarelyFluent implements IFrontendModule {
    async Render(root: HTMLElement, windowController: IWindowController): Promise<void> {
        root.appendChild(new App());
    }
}

export default new BarelyFluent();