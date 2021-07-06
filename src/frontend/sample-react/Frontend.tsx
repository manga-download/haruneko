import React from 'react';
import ReactDOM from 'react-dom';
import { IFrontendModule } from '../IFrontend';
import App from './App';

class SampleReact implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        ReactDOM.render(<App />, root);
        setTimeout(function () {
            window.dispatchEvent(new Event('appready'));
        }, 2500);
    }
}

export default new SampleReact();