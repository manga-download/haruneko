import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IFrontendModule } from '../IFrontend'
import App from './App';

class SampleReact implements IFrontendModule {

    SetWindowMenu(): void {
        // optionally change the menu of the NW.js window
    }

    async Render(root: HTMLElement): Promise<void> {
        ReactDOM.render(<App />, root);
    }
}

export default new SampleReact();