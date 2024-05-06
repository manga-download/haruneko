import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import { IWindowService } from '../services/WindowService';
import S from '../services/StateService';

// See: https://icon-sets.iconify.design/fluent/
import IconDownloadManager from '@fluentui/svg-icons/icons/arrow_download_20_regular.svg?raw';
import IconBookmarkList from '@fluentui/svg-icons/icons/bookmark_multiple_20_regular.svg?raw';
import IconBookmarksImport from '@fluentui/svg-icons/icons/arrow_import_20_filled.svg?raw';
import IconBookmarksExport from '@fluentui/svg-icons/icons/arrow_export_20_filled.svg?raw';
import IconWindowAd from '@fluentui/svg-icons/icons/window_ad_20_filled.svg?raw';
/*
import IconMinimize from '@fluentui/svg-icons/icons/subtract_20_filled.svg?raw';
import IconMaximize from '@fluentui/svg-icons/icons/window_20_filled.svg?raw'; // full_screen_maximize, maximize, square
import IconRestore from '@fluentui/svg-icons/icons/window_multiple_20_filled.svg?raw'; // full_screen_minimize, square_shadow, square_multiple, position_backward
import IconClose from '@fluentui/svg-icons/icons/dismiss_square_20_filled.svg?raw'; // dismiss
*/
// See: https://microsoft.github.io/vscode-codicons/dist/codicon.html
import IconMenu from '@vscode/codicons/src/icons/menu.svg?raw';
import IconFeatureFlags from '@vscode/codicons/src/icons/beaker.svg?raw'; // checklist.svg
import IconDebugConsole from '@vscode/codicons/src/icons/debug-console.svg?raw';
import IconCrowdinContextTranslation from '@vscode/codicons/src/icons/replace-all.svg?raw';
//const IconCrowdinContextTranslation = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 0H6.92C5.83725 0 4.84771 0.186432 3.97735 0.535597C3.17571 0.85719 2.47517 1.31683 1.896 1.896C1.29511 2.49689 0.822883 3.22843 0.5 4.06796C0.173775 4.91618 0 5.87465 0 6.92V17C0 18.1112 0.187582 19.1176 0.539967 20C0.862446 20.8075 1.32294 21.5111 1.904 22.096C2.48318 22.679 3.18395 23.1386 3.98903 23.46C4.87424 23.8135 5.88556 24 7 24H17C18.1112 24 19.1176 23.8124 20 23.46C20.8075 23.1376 21.5111 22.6771 22.096 22.096C22.6816 21.5142 23.1427 20.8097 23.4644 20C23.815 19.1174 24 18.1098 24 17V7C24 5.91727 23.8219 4.93396 23.4868 4.06796C23.1632 3.23192 22.6933 2.50523 22.096 1.904C21.5142 1.31837 20.8097 0.857267 20 0.535597C19.1174 0.184963 18.1098 0 17 0Z" fill="white"/><path d="M14.8479 14.6425C14.8399 14.5534 14.7679 14.2129 14.5359 14.2048C14.3039 14.2048 13.8159 14.2048 13.8159 14.2048C13.8159 14.2048 13.5199 14.2048 13.5199 14.4966C13.5279 15.064 13.8479 15.5503 14.2399 15.8745C14.5679 16.15 14.9679 16.2959 15.4239 16.2959C15.8239 16.2878 15.8719 15.996 15.6799 15.9069C15.3599 15.7529 14.9439 15.4125 14.8559 14.6425H14.8479Z" fill="#263238"/><path d="M17 6.82922C15.9686 6.82922 14.9371 6.95864 14 7.1925C13.1054 7.41574 12.2967 7.73415 11.656 8.12603C10.952 8.5556 10.408 9.07432 10.032 9.67409C9.72799 10.1604 9.52799 10.6872 9.45599 11.2546C9.43199 11.441 9.41599 12.0246 10.024 12.1786C10.4 12.2758 10.992 12.3163 11.384 12.365C12.024 12.4379 12.2 11.7166 12.256 11.595C12.76 10.1847 13.512 9.23642 14.584 8.61233C15.2379 8.23238 16.0276 7.97539 17 7.8308C17.6456 7.73481 18.3716 7.68836 19.192 7.68836C19.464 7.68836 20.096 7.72078 20.096 7.40468C20.096 7.16209 19.5987 7.02323 19 6.94374C18.1985 6.83733 17.2152 6.83733 17 6.83733V6.82922Z" fill="#263238"/><path d="M14.1919 17.5361C13.4639 17.3659 12.2399 16.5635 11.9599 14.5291C11.9039 14.1482 11.6959 13.9618 11.3759 13.8969C10.9519 13.8078 10.2079 13.7672 9.96793 13.7429C9.62393 13.7105 9.36793 13.9131 9.40793 14.521C9.47993 15.445 9.84793 16.1663 10.4639 16.8796C11.1919 17.7225 12.1519 18.2088 13.1759 18.1845C14.3039 18.1602 14.3839 17.9575 14.3919 17.8036C14.3919 17.6496 14.3199 17.5604 14.1919 17.528V17.5361Z" fill="#263238"/><path d="M11.128 19.2381C9.99995 19.2381 7.63195 17.4064 7.63195 14.5372C7.63195 14.0347 7.32795 13.5241 6.70395 13.3377C6.19995 13.1837 5.47995 12.9567 5.02395 12.9324C3.92795 12.8595 3.98395 13.7835 4.01595 14.2698C4.11995 16.3041 5.00795 18.0224 6.47195 18.995C7.07995 19.4002 7.79995 19.6758 8.64795 19.8379C8.84795 19.8784 9.55995 20.0243 10.28 20C11.392 19.9514 11.504 19.6272 11.504 19.4975C11.504 19.3273 11.384 19.2462 11.128 19.2462V19.2381Z" fill="#263238"/><path d="M20.376 4.84356C19.9227 4.71098 19.4635 4.5943 19 4.49334C18.3404 4.34964 17.6721 4.23777 17 4.15715C15.3439 3.95851 13.6641 3.94966 12.032 4.12221C10.5936 4.27707 8.98815 4.64008 7.59006 5.3866C6.13439 6.16386 4.9035 7.35686 4.31996 9.16355C4.19996 9.52827 3.98396 10.8656 5.24796 11.1898C5.65596 11.2952 6.07196 11.4816 6.50396 11.5626C7.73596 11.7896 7.99996 10.6062 8.07196 10.3712C8.14396 10.1443 8.22396 9.92542 8.31996 9.69848C8.71196 8.84745 9.29596 8.1261 9.95996 7.56685C11.336 6.39973 13.048 5.84858 14.712 5.58112C15.68 5.42712 16.648 5.36228 17.616 5.3866C18.1629 5.39867 18.6191 5.41638 19 5.4351C19.4164 5.45556 19.743 5.47724 20 5.4941C20.7699 5.54462 20.9156 5.55196 20.984 5.35417C21.096 5.02997 20.568 4.89219 20.376 4.84356Z" fill="#263238"/><path d="M17.872 9.48779C14.624 9.48779 13.776 11.1412 13.536 12.2435C13.424 12.7784 13.744 12.819 14.04 12.8757C14.456 12.9486 14.792 12.8838 14.944 12.4786C15.4 11.2223 16.024 9.99031 18 9.99031C18.2 9.99031 18.376 9.86063 18.376 9.73905C18.376 9.61747 18.248 9.48779 17.88 9.48779H17.872Z" fill="#263238"/></svg>`;
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
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Description()}" @click=${model => model.ShowGlobalSettingsDialog()}>
                <div slot="start" :innerHTML=${() => IconSettings}></div>
                ${() => S.Locale.Frontend_FluentCore_Menu_OpenSettings_Label()}
            </fluent-menu-item>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Description()}" @click=${model => model.ImportBookmarks()}>
                <div slot="start" :innerHTML=${() => IconBookmarksImport}></div>    
                ${() => S.Locale.Frontend_FluentCore_Menu_ImportBookmarks_Label()}
            </fluent-menu-item>
            <fluent-menu-item title="${() => S.Locale.Frontend_FluentCore_Menu_ExportBookmarks_Description()}" @click=${model => model.ExportBookmarks()}>
                <div slot="start" :innerHTML=${() => IconBookmarksExport}></div>   
                ${() => S.Locale.Frontend_FluentCore_Menu_ExportBookmarks_Label()}
            </fluent-menu-item>
            <fluent-divider></fluent-divider>
            <fluent-menu-item title="${() => S.Locale.Settings_FeatureFlags_Description()}">
                <div slot="start" :innerHTML=${() => IconFeatureFlags}></div>
                ${() => S.Locale.Settings_FeatureFlags_Label()}
                <fluent-menu>
                    <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale[HakuNeko.FeatureFlags.HideSplashScreen.Description]()}" :checked=${() => !HakuNeko.FeatureFlags.HideSplashScreen.Value} @change=${(_, ctx) => HakuNeko.FeatureFlags.HideSplashScreen.Value = !ctx.event.currentTarget['checked']}>
                        <div slot="start" :innerHTML=${() => IconWindowAd}></div>
                        ${() => S.Locale[HakuNeko.FeatureFlags.HideSplashScreen.Label]()}
                    </fluent-menu-item>
                    <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale[HakuNeko.FeatureFlags.VerboseFetchWindow.Description]()}" :checked=${() => HakuNeko.FeatureFlags.VerboseFetchWindow.Value} @change=${(_, ctx) => HakuNeko.FeatureFlags.VerboseFetchWindow.Value = ctx.event.currentTarget['checked']}>
                        <div slot="start" :innerHTML=${() => IconDebugConsole}></div>
                        ${() => S.Locale[HakuNeko.FeatureFlags.VerboseFetchWindow.Label]()}
                    </fluent-menu-item>
                    <fluent-menu-item role="menuitemcheckbox" title="${() => S.Locale[HakuNeko.FeatureFlags.CrowdinTranslationMode.Description]()}" :checked=${() => HakuNeko.FeatureFlags.CrowdinTranslationMode.Value} @change=${(_, ctx) => HakuNeko.FeatureFlags.CrowdinTranslationMode.Value = ctx.event.currentTarget['checked']}>
                        <div slot="start" :innerHTML=${() => IconCrowdinContextTranslation}></div>
                        ${() => S.Locale[HakuNeko.FeatureFlags.CrowdinTranslationMode.Label]()}
                    </fluent-menu-item>
                </fluent-menu>
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
            const summary = await HakuNeko.BookmarkPlugin.Export();
            console.log(summary);
        } catch(error) {
            // TODO: Show error to user
            console.error(error);
        }
    }
}