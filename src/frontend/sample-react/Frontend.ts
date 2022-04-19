import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleReact implements IFrontendModule {
    async Render(root: HTMLElement/*, windowController: IWindowController*/): Promise<void> {
        const app = createElement(App as React.FunctionComponent<JSX.Element>);
        createRoot(root).render(app);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleReact();