import { observable } from '@microsoft/fast-element';
import { Check, type Choice } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { GetLocale } from '../../../i18n/Localization';

const SettingKeys = {
    Scope: 'frontend.fluent-core',
    PanelBookmarks: 'panel.bookmarks',
    PanelDownloads: 'panel.downloads',
};

class StateService {

    private readonly settings = HakuNeko.SettingsManager.OpenScope(SettingKeys.Scope);

    constructor() {
        HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).ValueChanged.Subscribe(() => this.Locale = GetLocale());
        this.settingPanelBookmarksCheck.ValueChanged.Subscribe((_, args) => this.SettingPanelBookmarks = args);
        this.settingPanelDownloadsCheck.ValueChanged.Subscribe((_, args) => this.SettingPanelDownloads = args);
        this.Initialize();
    }

    private async Initialize() {
        await this.settings.Initialize(
            this.settingPanelBookmarksCheck,
            this.settingPanelDownloadsCheck
        );
        this.SettingPanelBookmarks = this.settingPanelBookmarksCheck.Value;
        this.SettingPanelDownloads = this.settingPanelDownloadsCheck.Value;
    }

    @observable Locale = GetLocale();

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