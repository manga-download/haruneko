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
        // wait for frontend to be loaded and rendered
        await new Promise(resolve => setTimeout(resolve, 2500));
    }
}

export default new SampleReact();