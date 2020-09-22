import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IFrontendModule } from '../IFrontend'
import App from './App';

class SampleReact implements IFrontendModule {

    async Render(root: HTMLElement): Promise<void> {
        ReactDOM.render(<App />, root);
    }
}

export default new SampleReact();