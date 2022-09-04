import { observable } from '@microsoft/fast-element';
import { baseLayerLuminance, StandardLuminance } from '@fluentui/web-components';
import { Check, type Choice, Numeric } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { GetLocale } from '../../../i18n/Localization';

const SettingKeys = {
    Scope: 'frontend.fluent-core',
    ThemeLuminance: 'theme.luminance',
    PanelBookmarks: 'panel.bookmarks',
    PanelDownloads: 'panel.downloads',
};

class StateService {

    private readonly settings = HakuNeko.SettingsManager.OpenScope(SettingKeys.Scope);

    constructor() {
        HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).ValueChanged.Subscribe(() => this.Locale = GetLocale());
        this.settingThemeLuminanceNumeric.ValueChanged.Subscribe((_, args) => this.SettingThemeLuminance = args);
        this.settingPanelBookmarksCheck.ValueChanged.Subscribe((_, args) => this.SettingPanelBookmarks = args);
        this.settingPanelDownloadsCheck.ValueChanged.Subscribe((_, args) => this.SettingPanelDownloads = args);
        this.Initialize();
    }

    private async Initialize() {
        await this.settings.Initialize(
            this.settingThemeLuminanceNumeric,
            this.settingPanelBookmarksCheck,
            this.settingPanelDownloadsCheck
        );
        this.SettingThemeLuminance = this.settingThemeLuminanceNumeric.Value;
        this.SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
        this.SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    }

    @observable Locale = GetLocale();

    private readonly settingThemeLuminanceNumeric = new Numeric(SettingKeys.ThemeLuminance, undefined, undefined, StandardLuminance.LightMode, 0.0, 1.0);
    @observable SettingThemeLuminance = this.settingThemeLuminanceNumeric.Value;
    SettingThemeLuminanceChanged() {
        this.settingThemeLuminanceNumeric.Value = this.SettingThemeLuminance;
        baseLayerLuminance.setValueFor(document.body, this.SettingThemeLuminance);
    }

    private readonly settingPanelBookmarksCheck = new Check(SettingKeys.PanelBookmarks, undefined, undefined, true);
    @observable SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
    SettingPanelBookmarksChanged() {
        this.settingPanelBookmarksCheck.Value = this.SettingPanelBookmarks;
    }

    private readonly settingPanelDownloadsCheck = new Check(SettingKeys.PanelDownloads, undefined, undefined, false);
    @observable SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    SettingPanelDownloadsChanged() {
        this.settingPanelDownloadsCheck.Value = this.SettingPanelDownloads;
    }
}

export default new StateService();