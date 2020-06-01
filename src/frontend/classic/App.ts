let buttons = window.Frontend.AvailableFrontends
    .filter(info => info.ID !== 'classic')
    .map(info => `<li><a href="#" onclick="Frontend.Load('${info.ID}')" title="${info.Description}">Load Frontend: ${info.Label}</a></li>`).join('');

const htmlContent = `
    <div style="padding: 2em;">
        <p>
            <strong>Platform :</strong> ${process.platform}<br>
            <strong>NW.js :</strong> ${process.versions['node-webkit']}
        </p>
        <ul>
            ${buttons}
        </ul>
    </div>
`;

export default class App {

    constructor(root: HTMLElement) {
        // artificial delay to make loading screen visible
        //await new Promise(resolve => setTimeout(resolve, 2500));
        root.innerHTML = htmlContent;
    }
}