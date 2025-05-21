import { observable } from '@microsoft/fast-element';
import { DI, Registration } from '@microsoft/fast-element/di.js';
import { webLightTheme, webDarkTheme } from '@fluentui/tokens';
import { setTheme } from '@fluentui/web-components';
import { type ISetting, Check, Choice, type Directory } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { FrontendResourceKey as R } from '../../../i18n/ILocale';
import { GetLocale } from '../../../i18n/Localization';

const SettingKeys = {
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

// TODO: Split into SettingService and LocaleService
class StateManager {

    public readonly GlobalSettings = HakuNeko.SettingsManager.OpenScope();
    private readonly frontendSettings = HakuNeko.SettingsManager.OpenScope(SettingKeys.Scope);

    constructor() {
        this.SettingMediaDirectory = this.GlobalSettings.Get<Directory>(GlobalKey.MediaDirectory);
        this.GlobalSettings.Get<Choice>(GlobalKey.Language).Subscribe(() => this.Locale = GetLocale());
        this.settingThemeChoice.Subscribe(value => this.SettingSelectedTheme = Themes.get(value));
        this.settingPanelBookmarksCheck.Subscribe(value => this.SettingPanelBookmarks = value);
        this.settingPanelDownloadsCheck.Subscribe(value => this.SettingPanelDownloads = value);
        this.Initialize();
    }

    private async Initialize() {
        await this.frontendSettings.Initialize(
            this.settingThemeChoice,
            this.settingPanelBookmarksCheck,
            this.settingPanelDownloadsCheck
        );
        this.SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
        this.SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    }

    @observable Locale = GetLocale();
    public readonly SettingMediaDirectory: Directory;

    private readonly settingThemeChoice = new Choice(SettingKeys.Theme, R.Frontend_FluentCore_Settings_ThemeMode_Label, R.Frontend_FluentCore_Settings_ThemeMode_Description, ThemeWebLight.key, ThemeWebDark, ThemeWebLight);
    @observable SettingSelectedTheme = Themes.get(this.settingThemeChoice.Value);
    SettingSelectedThemeChanged() {
        this.settingThemeChoice.Value = this.SettingSelectedTheme.key;
        setTheme(this.SettingSelectedTheme.value);
    }

    private readonly settingPanelBookmarksCheck = new Check(SettingKeys.PanelBookmarks, R.Frontend_FluentCore_Settings_ShowBookmarksPanel_Label, R.Frontend_FluentCore_Settings_ShowBookmarksPanel_Description, true);
    @observable SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
    SettingPanelBookmarksChanged() {
        this.settingPanelBookmarksCheck.Value = this.SettingPanelBookmarks;
    }

    private readonly settingPanelDownloadsCheck = new Check(SettingKeys.PanelDownloads, R.Frontend_FluentCore_Settings_ShowDownloadsPanel_Label, R.Frontend_FluentCore_Settings_ShowDownloadsPanel_Description, false);
    @observable SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    SettingPanelDownloadsChanged() {
        this.settingPanelDownloadsCheck.Value = this.SettingPanelDownloads;
    }

    @observable ShowSettingsDialog: (...settings: ISetting[]) => void = () => {};
}

export type { StateManager };
export const StateManagerService = DI.createContext<StateManager>();
DI.getOrCreateDOMContainer(document.body).register(Registration.instance(StateManagerService, new StateManager()));

// TODO: Use service instead of exported instance
export const S = new StateManager();