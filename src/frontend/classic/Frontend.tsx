import { IFrontendModule } from '../IFrontend'
const React = require('react');
const ReactDOM = require('react-dom');

export default class Classic implements IFrontendModule {

    async Render(root: Element): Promise<void> {
        // artificial delay to make loading screen visible
        await new Promise(resolve => setTimeout(resolve, 1500));
        ReactDOM.render(<strong>HakuNeko Frontend Classic (React)</strong>, root);
    }
}