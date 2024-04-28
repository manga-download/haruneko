import { VariantResourceKey as R } from '../i18n/ILocale';
import { Check, type ISettings, type SettingsManager } from './SettingsManager';
import { FrontendController } from '../frontend/FrontendController';

/**
 * Provide flags for switching functionality that is not meant to be controlled by the end-user.
 */
export class FeatureFlags {

    readonly #settings: ISettings;
    public readonly HideSplashScreen = new Check('no-splash', R.Frontend_FluentCore_Settings_FeatureFlags_ShowSplashScreen_Label, R.Frontend_FluentCore_Settings_FeatureFlags_ShowSplashScreen_Description, false);
    public readonly VerboseFetchWindow = new Check('verbose-fetchwindow', R.Frontend_FluentCore_Settings_FeatureFlags_ShowFetchBrowserWindows_Label, R.Frontend_FluentCore_Settings_FeatureFlags_ShowFetchBrowserWindows_Description, false);
    public readonly CrowdinTranslationMode = new Check('crowdin-translation', R.Frontend_FluentCore_Settings_FeatureFlags_CrowdinTranslationMode_Label, R.Frontend_FluentCore_Settings_FeatureFlags_CrowdinTranslationMode_Description, false);

    constructor(private readonly settingsManager: SettingsManager) {
        this.#settings = this.settingsManager.OpenScope('feature-flags');
    }

    public async Initialize(): Promise<void> {
        await this.#settings.Initialize(this.HideSplashScreen, this.VerboseFetchWindow, this.CrowdinTranslationMode);
        this.CrowdinTranslationMode.Subscribe(FrontendController.RequestReload);
    }
}