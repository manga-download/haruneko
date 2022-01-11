import { createElement } from 'react';
import ReactDOM from 'react-dom';
import type { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleReact implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        ReactDOM.render(createElement(App as any/*FunctionComponent<DOMAttributes<never>>*/), root);
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleReact();