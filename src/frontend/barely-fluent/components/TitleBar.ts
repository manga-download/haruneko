import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import S from '../services/StateService';

// See: https://icon-sets.iconify.design/fluent/
/*
import IconMinimize from '@fluentui/svg-icons/icons/subtract_20_filled.svg?raw';
import IconMaximize from '@fluentui/svg-icons/icons/window_20_filled.svg?raw'; // full_screen_maximize, maximize, square
import IconRestore from '@fluentui/svg-icons/icons/window_multiple_20_filled.svg?raw'; // full_screen_minimize, square_shadow, square_multiple, position_backward
import IconClose from '@fluentui/svg-icons/icons/dismiss_square_20_filled.svg?raw'; // dismiss
*/
// See: https://microsoft.github.io/vscode-codicons/dist/codicon.html
import IconMenu from '@vscode/codicons/src/icons/menu.svg?raw';
import IconMinimize from '@vscode/codicons/src/icons/chrome-minimize.svg?raw';
import IconMaximize from '@vscode/codicons/src/icons/chrome-maximize.svg?raw';
import IconRestore from '@vscode/codicons/src/icons/chrome-restore.svg?raw';
import IconClose from '@vscode/codicons/src/icons/chrome-close.svg?raw';

const styles: ElementStyles = css`
    :host {
        gap: 4px;
        display: grid;
        align-items: center;
        grid-template-columns: max-content auto max-content;
        background-color: var(--neutral-layer-2);
        padding: 0px 4px 0px 4px;
        user-select: none;
    }
    fluent-button {
        --neutral-fill-stealth-rest: transparent;
    }
    #menu {
    }
    #title {
        font-weight: bold;
        text-align: center;
        -webkit-app-region: drag;
    }
    #controls {
        /* ... */
    }
    #controls fluent-anchor {
        --neutral-fill-stealth-rest: transparent;
    }
    #controls fluent-anchor:hover {
        background-color: var(--neutral-fill-stealth-hover);
    }
    fluent-anchor#close:hover {
        background-color: #FF6060 !important;
    }
    #settings-dialog {
        /* display: grid; */
    }
`;

const template: ViewTemplate<TitleBar> = html`
    <div id="menu">
        <fluent-button appearance="stealth" @click=${model => model.OpenSettings()}>${IconMenu}</fluent-button>
    </div>
    <div id="title">${() => S.Locale.Frontend_Product_Title()}</div>
    <div id="controls">
        <fluent-anchor appearance="stealth" @click="${model => model.Minimize()}">${IconMinimize}</fluent-anchor>
        <fluent-anchor appearance="stealth" @click="${model => model.Maximize()}" :innerHTML=${model => model.maximized ? IconRestore : IconMaximize}></fluent-anchor>
        <fluent-anchor id="close" appearance="stealth" @click=${model => model.Close()}>${IconClose}</fluent-anchor>
    </div>
    <fluent-dialog id="settings-dialog" ?hidden=${model => !model.settings} trap-focus modal>
        <fluent-setting-theme-luminance style="width: 100%;"></fluent-setting-theme-luminance>
        <fluent-divider></fluent-divider>
        <fluent-button id="settings-close-button" appearance="accent" @click=${model => model.CloseSettings()}>LOCALE:TitleBar_CloseSettingsButton_Label</fluent-button>
    </fluent-dialog>
`;

@customElement({ name: 'fluent-titlebar', template, styles })
export class TitleBar extends FASTElement {

    //@inject(AccountService) accountService!: IAccountService;

    @observable maximized = false;
    @observable settings = false;

    @observable locale = {
        'ApplicationTitle': (...params: string[]) => 'My Application (EN)' + params.join(', '),
    };

    public Minimize(): void {
        console.log('Minimize ...');
        //this.windowController.Minimize();
    }

    public Maximize(): void {
        console.log('Maximize ...');
        //this.windowController.Maximize();
    }

    public Close(): void {
        console.log('Close ...');
        //this.windowController.Close();
        window.close();
    }

    public OpenSettings() {
        this.settings = true;
    }

    public CloseSettings() {
        // TODO: save stuff ...
        this.settings = false;
    }
}