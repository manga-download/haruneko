import { DI } from '@microsoft/fast-element/di.js';
import { observable } from '@microsoft/fast-element';
import { webLightTheme, webDarkTheme } from '@fluentui/tokens';
import { setTheme } from '@fluentui/web-components';
import { type ISetting, Check, Choice, type Directory } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { FrontendResourceKey as R } from '../../../i18n/ILocale';

const FrontendSettingKeys = {
    Scope: 'frontend.fluent-core',
    Theme: 'theme',
    PanelBookmarks: 'panel.bookmarks',
    PanelDownloads: 'panel.downloads',
};

export const ThemeWebDark = {
    key: 'web-dark',
    value: webDarkTheme,
    label: R.Frontend_FluentCore_Settings_ThemeMode_WebDark,
};

export const ThemeWebLight = {
    key: 'web-light',
    value: webLightTheme,
    label: R.Frontend_FluentCore_Settings_ThemeMode_WebLight,
};

export const Themes = new Map<string, typeof ThemeWebLight>([
    [ ThemeWebDark.key, ThemeWebDark ],
    [ ThemeWebLight.key, ThemeWebLight ],
]);

export class SettingsManager {

    readonly #globalSettings = HaruNeko.SettingsManager.OpenScope();
    readonly #frontendSettings = HaruNeko.SettingsManager.OpenScope(FrontendSettingKeys.Scope);

    constructor () {
        this.SettingLanguage = this.#globalSettings.Get<Choice>(GlobalKey.Language);
        this.SettingMediaDirectory = this.#globalSettings.Get<Directory>(GlobalKey.MediaDirectory);
        this.settingThemeChoice.Subscribe(value => this.SettingSelectedTheme = Themes.get(value));
        this.settingPanelBookmarksCheck.Subscribe(value => this.SettingPanelBookmarks = value);
        this.settingPanelDownloadsCheck.Subscribe(value => this.SettingPanelDownloads = value);
        this.Initialize();
    }

    private async Initialize() {
        await this.#frontendSettings.Initialize(
            this.settingThemeChoice,
            this.settingPanelBookmarksCheck,
            this.settingPanelDownloadsCheck
        );
        this.SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
        this.SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    }

    public get GlobalSettings() {
        return [ ...this.#globalSettings ];
    }

    public get FrontendSettings() {
        return [ ...this.#frontendSettings ];
    }

    public readonly SettingLanguage: Choice;

    // TODO: Is this used?
    public readonly SettingMediaDirectory: Directory;

    private readonly settingThemeChoice = new Choice(FrontendSettingKeys.Theme, R.Frontend_FluentCore_Settings_ThemeMode_Label, R.Frontend_FluentCore_Settings_ThemeMode_Description, ThemeWebLight.key, ThemeWebDark, ThemeWebLight);
    @observable SettingSelectedTheme = Themes.get(this.settingThemeChoice.Value);
    SettingSelectedThemeChanged() {
        this.settingThemeChoice.Value = this.SettingSelectedTheme.key;
        setTheme(this.SettingSelectedTheme.value);
    }

    private readonly settingPanelBookmarksCheck = new Check(FrontendSettingKeys.PanelBookmarks, R.Frontend_FluentCore_Settings_ShowBookmarksPanel_Label, R.Frontend_FluentCore_Settings_ShowBookmarksPanel_Description, true);
    @observable SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
    SettingPanelBookmarksChanged() {
        this.settingPanelBookmarksCheck.Value = this.SettingPanelBookmarks;
    }

    private readonly settingPanelDownloadsCheck = new Check(FrontendSettingKeys.PanelDownloads, R.Frontend_FluentCore_Settings_ShowDownloadsPanel_Label, R.Frontend_FluentCore_Settings_ShowDownloadsPanel_Description, false);
    @observable SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    SettingPanelDownloadsChanged() {
        this.settingPanelDownloadsCheck.Value = this.SettingPanelDownloads;
    }

    // TODO: Make non-observable?
    @observable ShowSettingsDialog: (...settings: ISetting[]) => void = () => { };
}

export type { SettingsManager as ISettingsManager };
export const SettingsManagerRegistration = DI.createContext<SettingsManager>();