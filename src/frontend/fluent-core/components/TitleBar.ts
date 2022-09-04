import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { SettingsDialog } from './SettingsDialog';
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
import IconSettings from '@vscode/codicons/src/icons/settings.svg?raw';
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
        display: block;
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

    #menu-overlay {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2147483647;
    }

    #menu-popup {
        display: none;
        position: absolute;
        z-index: 2147483647;
    }
`;

const template: ViewTemplate<TitleBar> = html`
    <div id="menu">
        <fluent-button id="menu-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Menu_Description()}" @click=${model => model.popup = !model.popup}>${IconMenu}</fluent-button>
        <div id="menu-overlay" style="display: ${model => model.popup ? 'block' : 'none'}" @click=${model => model.popup = false}></div>
        <fluent-menu id="menu-popup" style="display: ${model => model.popup ? 'block' : 'none'}">
            <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale.Frontend_FluentCore_Settings_ShowBookmarksPanel_Description()}" :checked=${() => S.SettingPanelBookmarks} @change=${(_, ctx) => S.SettingPanelBookmarks = ctx.event.currentTarget['checked']}>
                <div slot="start">${IconBookmarkList}</div>
                ${() => S.Locale.Frontend_FluentCore_Settings_ShowBookmarksPanel_Label()}
            </fluent-menu-item>
            <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale.Frontend_FluentCore_Settings_ShowDownloadsPanel_Description()}" :checked=${() => S.SettingPanelDownloads} @change=${(_, ctx) => S.SettingPanelDownloads = ctx.event.currentTarget['checked']}>
                <div slot="start">${IconDownloadManager}</div>
                ${() => S.Locale.Frontend_FluentCore_Settings_ShowDownloadsPanel_Label()}
            </fluent-menu-item>
            <fluent-divider></fluent-divider>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Description()}" @click=${model => model.ShowGlobalSettingsDialog()}>
                <div slot="start">${IconSettings}</div>
                ${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Label()}
            </fluent-menu-item>
            <fluent-menu-item disabled title="${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Description()}" @click=${model => model.ShowImportDialog()}>
                ${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Label()}
            </fluent-menu-item>
            <fluent-divider></fluent-divider>
            <fluent-setting-theme-luminance></fluent-setting-theme-luminance>
        </fluent-menu>
    </div>
    <div id="title">${() => S.Locale.Frontend_Product_Title()}</div>
    <div id="controls">
        <fluent-anchor appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Window_ButtonMinimize_Description()}" @click="${model => model.Minimize()}">${IconMinimize}</fluent-anchor>
        <fluent-anchor appearance="stealth" title="${model => model.maximized ? S.Locale.Frontend_FluentCore_Window_ButtonRestore_Description() : S.Locale.Frontend_FluentCore_Window_ButtonMaximize_Description()}" @click="${model => model.Maximize()}" :innerHTML=${model => model.maximized ? IconRestore : IconMaximize}></fluent-anchor>
        <fluent-anchor id="close" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Window_ButtonClose_Description()}" @click=${model => model.Close()}>${IconClose}</fluent-anchor>
    </div>
    <fluent-settings-dialog id="settings" :hidden=${model => !model.settings}></fluent-settings-dialog>
`;

@customElement({ name: 'fluent-titlebar', template, styles })
export class TitleBar extends FASTElement {

    @observable maximized = false;
    @observable settings = false;
    @observable popup = false;

    public ShowGlobalSettingsDialog() {
        this.popup = false;
        const dialog = this.shadowRoot.querySelector<SettingsDialog>('#settings');
        dialog.Show(...HakuNeko.SettingsManager.OpenScope());
    }

    public ShowImportDialog()
    {
        this.popup = false;
    }

    public Minimize(): void {
        console.log('Minimize ...');
        //TODO: this.windowController.Minimize();
    }

    public Maximize(): void {
        console.log('Maximize ...');
        //TODO: this.windowController.Maximize();
    }

    public Close(): void {
        console.log('Close ...');
        //TODO: this.windowController.Close();
        window.close();
    }
}