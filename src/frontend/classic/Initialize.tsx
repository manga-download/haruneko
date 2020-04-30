//const fs = require('fs-extra');
//const React = require('react');
//const ReactDOM = require('react-dom');

export default async function (root: HTMLElement): Promise<void> {
    // artificial delay to make loading screen visible
    await new Promise(resolve => setTimeout(resolve, 1500));
    // @ts-ignore : 'ReactDOM' refers to a UMD global, but the current file is a module. Consider adding an import instead. ts(2686)
    ReactDOM.render(<strong>HakuNeko Frontend Classic (React)</strong>, root);
}