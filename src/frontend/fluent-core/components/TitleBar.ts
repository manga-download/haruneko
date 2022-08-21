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
import IconBookmarkList from '@fluentui/svg-icons/icons/bookmark_multiple_20_regular.svg?raw'; // star_line_horizontal_3_20_regular
import IconDownloadManager from '@fluentui/svg-icons/icons/arrow_download_20_regular.svg?raw'; // arrow_swap_2-_regular
import IconMinimize from '@vscode/codicons/src/icons/chrome-minimize.svg?raw';
import IconMaximize from '@vscode/codicons/src/icons/chrome-maximize.svg?raw';
import IconRestore from '@vscode/codicons/src/icons/chrome-restore.svg?raw';
import IconClose from '@vscode/codicons/src/icons/chrome-close.svg?raw';

const styles: ElementStyles = css`

    :host {
        gap: 0;
        display: grid;
        align-items: center;
        grid-template-columns: max-content auto max-content;
        background-color: var(--neutral-layer-2);
    }

    fluent-button {
        --neutral-fill-stealth-rest: transparent;
    }

    #menu {
        display: flex;
    }

    #title {
        font-weight: bold;
        text-align: center;
        -webkit-app-region: drag;
    }

    #controls {
        display: flex;
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
        z-index: 2147483647;
    }
`;

const template: ViewTemplate<TitleBar> = html`
    <div id="menu">
        <fluent-button appearance="stealth" @click=${model => model.settings = true}>${IconMenu}</fluent-button>
        <!--
        <fluent-button appearance="stealth">${IconBookmarkList}</fluent-button>
        <fluent-button appearance="stealth">${IconDownloadManager}</fluent-button>
        -->
    </div>
    <div id="title">${() => S.Locale.Frontend_Product_Title()}</div>
    <div id="controls">
        <fluent-anchor appearance="stealth" @click="${model => model.Minimize()}">${IconMinimize}</fluent-anchor>
        <fluent-anchor appearance="stealth" @click="${model => model.Maximize()}" :innerHTML=${model => model.maximized ? IconRestore : IconMaximize}></fluent-anchor>
        <fluent-anchor id="close" appearance="stealth" @click=${model => model.Close()}>${IconClose}</fluent-anchor>
    </div>
    <fluent-settings-dialog :hidden=${model => !model.settings}></fluent-settings-dialog>
`;

@customElement({ name: 'fluent-titlebar', template, styles })
export class TitleBar extends FASTElement {

    @observable maximized = false;
    @observable settings = false;

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
}