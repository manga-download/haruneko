import { observable } from '@microsoft/fast-element';
import { baseLayerLuminance, StandardLuminance } from '@fluentui/web-components';
import { type ISetting, Check, type Choice, Numeric } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { FrontendResourceKey as R } from '../../../i18n/ILocale';
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
        HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).Subscribe(() => this.Locale = GetLocale());
        this.settingThemeLuminanceNumeric.Subscribe(value => this.SettingThemeLuminance = value);
        this.settingPanelBookmarksCheck.Subscribe(value => this.SettingPanelBookmarks = value);
        this.settingPanelDownloadsCheck.Subscribe(value => this.SettingPanelDownloads = value);
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

    private readonly settingThemeLuminanceNumeric = new Numeric(SettingKeys.ThemeLuminance, R.Frontend_FluentCore_Settings_ThemeLuminance_Label, R.Frontend_FluentCore_Settings_ThemeLuminance_Description, StandardLuminance.LightMode, 0.0, 1.0);
    @observable SettingThemeLuminance = this.settingThemeLuminanceNumeric.Value;
    SettingThemeLuminanceChanged() {
        this.settingThemeLuminanceNumeric.Value = this.SettingThemeLuminance;
        baseLayerLuminance.setValueFor(document.body, this.SettingThemeLuminance);
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

    public ShowSettingsDialog: (...settings: ISetting[]) => void;
}

export default new StateService();