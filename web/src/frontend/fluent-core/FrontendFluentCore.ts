//import { provideFluentDesignSystem, allComponents as allFluentComponents } from '@fluentui/web-components';
//provideFluentDesignSystem().withShadowRootMode('closed').register(allFluentComponents);

import '@fluentui/web-components/dialog.js';
import '@fluentui/web-components/divider.js';
import '@fluentui/web-components/menu.js';
import '@fluentui/web-components/menu-list.js';
import '@fluentui/web-components/menu-item.js';
import '@fluentui/web-components/menu-button.js';
import '@fluentui/web-components/anchor-button.js';
import '@fluentui/web-components/button.js';
import '@fluentui/web-components/slider.js';
import '@fluentui/web-components/checkbox.js';
//import '@fluentui/web-components/field.js';
import '@fluentui/web-components/text-input.js';
import '@fluentui/web-components/progress-bar.js';

import { setTheme } from '@fluentui/web-components';
import { webDarkTheme, webLightTheme } from '@fluentui/tokens';
setTheme(webDarkTheme); // TODO: Load user selected theme from settings ...
setTimeout(() => setTheme(webLightTheme), 5000);

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

// TODO: Fix all Fluent Elements ...