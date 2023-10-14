import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import S from '../services/StateService';

// See: https://icon-sets.iconify.design/fluent/
import BookmarksImport from '@fluentui/svg-icons/icons/arrow_import_20_filled.svg?raw';
import BookmarksExport from '@fluentui/svg-icons/icons/arrow_export_20_filled.svg?raw';
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
import IconWindowAd from '@fluentui/svg-icons/icons/window_ad_20_filled.svg?raw';
import IconSettings from '@vscode/codicons/src/icons/settings.svg?raw';
import IconMinimize from '@vscode/codicons/src/icons/chrome-minimize.svg?raw';
import IconMaximize from '@vscode/codicons/src/icons/chrome-maximize.svg?raw';
import IconRestore from '@vscode/codicons/src/icons/chrome-restore.svg?raw';
import IconClose from '@vscode/codicons/src/icons/chrome-close.svg?raw';
import { IWindowService } from '../services/WindowService';

const styles: ElementStyles = css`

    :host {
        gap: 0;
        display: grid;
        align-items: center;
        grid-template-columns: max-content auto max-content;
        border-top-left-radius: calc(1px * var(--layer-corner-radius));
        border-top-right-radius: calc(1px * var(--layer-corner-radius));
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

    fluent-menu-item div[slot="start"] {
        display: flex;
    }
`;

const template: ViewTemplate<TitleBar> = html`
    <div id="menu">
        <fluent-button id="menu-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Menu_Description()}" :innerHTML=${() => IconMenu} @click=${model => model.popup = !model.popup}></fluent-button>
        <div id="menu-overlay" style="display: ${model => model.popup ? 'block' : 'none'}" @click=${model => model.popup = false}></div>
        <fluent-menu id="menu-popup" style="display: ${model => model.popup ? 'block' : 'none'}">
            <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale.Frontend_FluentCore_Settings_ShowBookmarksPanel_Description()}" :checked=${() => S.SettingPanelBookmarks} @change=${(_, ctx) => S.SettingPanelBookmarks = ctx.event.currentTarget['checked']}>
                <div slot="start" :innerHTML=${() => IconBookmarkList}></div>
                ${() => S.Locale.Frontend_FluentCore_Settings_ShowBookmarksPanel_Label()}
            </fluent-menu-item>
            <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale.Frontend_FluentCore_Settings_ShowDownloadsPanel_Description()}" :checked=${() => S.SettingPanelDownloads} @change=${(_, ctx) => S.SettingPanelDownloads = ctx.event.currentTarget['checked']}>
                <div slot="start" :innerHTML=${() => IconDownloadManager}></div>
                ${() => S.Locale.Frontend_FluentCore_Settings_ShowDownloadsPanel_Label()}
            </fluent-menu-item>
            <fluent-divider></fluent-divider>
            <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale.Frontend_FluentCore_Settings_ShowSplashScreen_Description()}" :checked=${() => window.localStorage.getItem('hakuneko-nosplash') !== 'true'} @change=${(_, ctx) => window.localStorage.setItem('hakuneko-nosplash', (!ctx.event.currentTarget['checked']).toString())}>
                <div slot="start" :innerHTML=${() => IconWindowAd}></div>
                ${() => S.Locale.Frontend_FluentCore_Settings_ShowSplashScreen_Label()}
            </fluent-menu-item>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Description()}" @click=${model => model.ShowGlobalSettingsDialog()}>
                <div slot="start" :innerHTML=${() => IconSettings}></div>
                ${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Label()}
            </fluent-menu-item>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Description()}" @click=${model => model.ImportBookmarks()}>
                <div slot="start" :innerHTML=${() => BookmarksImport}></div>    
                ${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Label()}
            </fluent-menu-item>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_ExportBookmarks_Description()}" @click=${model => model.ExportBookmarks()}>
                <div slot="start" :innerHTML=${() => BookmarksExport}></div>   
                ${() => S.Locale.Frontend_FluentCore_Menu_ExportBookmarks_Label()}
            </fluent-menu-item>
            <fluent-divider></fluent-divider>
            <fluent-setting-theme-luminance></fluent-setting-theme-luminance>
        </fluent-menu>
    </div>
    <div id="title">${() => S.Locale.Frontend_Product_Title()}</div>
    <div id="controls">
        <fluent-anchor appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Window_ButtonMinimize_Description()}" :innerHTML=${() => IconMinimize} @click="${model => model.window.Minimize()}"></fluent-anchor>
        <fluent-anchor appearance="stealth" title="${model => model.window.IsMaximized ? S.Locale.Frontend_FluentCore_Window_ButtonRestore_Description() : S.Locale.Frontend_FluentCore_Window_ButtonMaximize_Description()}" :innerHTML=${model => model.window.IsMaximized ? IconRestore : IconMaximize} @click="${model => model.window.IsMaximized ? model.window.Restore() : model.window.Maximize()}"></fluent-anchor>
        <fluent-anchor id="close" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Window_ButtonClose_Description()}" :innerHTML=${() => IconClose} @click=${model => model.window.Close()}></fluent-anchor>
    </div>
`;

@customElement({ name: 'fluent-titlebar', template, styles })
export class TitleBar extends FASTElement {

    @IWindowService window!: IWindowService;
    @observable maximized = false;
    @observable settings = false;
    @observable popup = false;

    public ShowGlobalSettingsDialog() {
        this.popup = false;
        S.ShowSettingsDialog(...HakuNeko.SettingsManager.OpenScope());
    }

    public async ImportBookmarks()
    {
        try {
            this.popup = false;
            const summary = await HakuNeko.BookmarkPlugin.Import();
            console.log(summary);
        } catch(error) {
            // TODO: Show error to user
            console.error(error);
        }
    }

    public async ExportBookmarks()
    {
        try {
            this.popup = false;
            await HakuNeko.BookmarkPlugin.Export();
        } catch(error) {
            // TODO: Show error to user
            console.error(error);
        }
    }
}