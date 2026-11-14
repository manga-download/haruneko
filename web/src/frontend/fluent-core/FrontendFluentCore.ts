import { DOM } from '@microsoft/fast-element';
import { DI, Registration } from '@microsoft/fast-element/di.js';
import { App } from './components/_index'; // Import also registers the web-components
import type { IFrontendModule } from '../IFrontend';
import type { IAppWindow } from '../../engine/platform/AppWindow';
import { WindowManagerRegistration, WindowManager } from './services/WindowManager';
import { SettingsManagerRegistration, SettingsManager } from './services/SettingsManager';
import { LocalizationProviderRegistration, LocalizationProvider } from './services/LocalizationProvider';
import { InteractiveFileContentProviderRegistration, InteractiveFileContentProvider } from './services/InteractiveFileContentProvider';

class FluentCore implements IFrontendModule {

    RegisterDependencies(windowController: IAppWindow) {
        const container = DI.getOrCreateDOMContainer(document.body);
        container.register(Registration.singleton(SettingsManagerRegistration, SettingsManager));
        container.register(Registration.singleton(LocalizationProviderRegistration, LocalizationProvider));
        container.register(Registration.instance(WindowManagerRegistration, new WindowManager(windowController)));
        container.register(Registration.singleton(InteractiveFileContentProviderRegistration, InteractiveFileContentProvider));
    }

    async Render(root: HTMLElement, windowController: IAppWindow): Promise<void> {
        // This will allow to bypass FAST check for assigning non-sanitized strings directly to `:innerHTML` instead of a TrustedHTML wrapper
        DOM.setPolicy({ createHTML: (value: string) => value, protect: (_1, _2, _3, sink) => sink });
        this.RegisterDependencies(windowController);
        root.appendChild(new App());
    }
}

export default new FluentCore();