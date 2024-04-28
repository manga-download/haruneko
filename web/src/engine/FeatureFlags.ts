import { VariantResourceKey as R } from '../i18n/ILocale';
import { Check, type ISettings, type SettingsManager } from './SettingsManager';
import { FrontendController } from '../frontend/FrontendController';

const scope = 'feature-flags';

const enum Key {
    HideSplashScreen = 'HideSplashScreen',
    VerboseFetchWindow = 'VerboseFetchWindow',
    CrowdinTranslationMode = 'CrowdinTranslationMode',
}

/**
 * Provide flags for switching functionality that is not meant to be controlled by the end-user.
 */
export class FeatureFlags {

    readonly #settings: ISettings;

    /**
     * This a performance optimized getter accessing the stored value directly that should only be used during boot.
     */
    public static get ShowSplashScreen() {
        return window.localStorage.getItem(Key.HideSplashScreen) !== 'true';
    }
    public readonly HideSplashScreen = new Check(Key.HideSplashScreen, R.Settings_FeatureFlags_ShowSplashScreen_Label, R.Settings_FeatureFlags_ShowSplashScreen_Description, false);
    public readonly VerboseFetchWindow = new Check(Key.VerboseFetchWindow, R.Settings_FeatureFlags_ShowFetchBrowserWindows_Label, R.Settings_FeatureFlags_ShowFetchBrowserWindows_Description, false);
    public readonly CrowdinTranslationMode = new Check(Key.CrowdinTranslationMode, R.Settings_FeatureFlags_CrowdinTranslationMode_Label, R.Settings_FeatureFlags_CrowdinTranslationMode_Description, false);

    constructor(private readonly settingsManager: SettingsManager) {
        this.#settings = this.settingsManager.OpenScope(scope);
    }

    public async Initialize(): Promise<void> {
        await this.#settings.Initialize(this.HideSplashScreen, this.VerboseFetchWindow, this.CrowdinTranslationMode);
        this.HideSplashScreen.Subscribe(value => window.localStorage.setItem(Key.HideSplashScreen, `${value}`));
        this.CrowdinTranslationMode.Subscribe(FrontendController.RequestReload);
        // TODO: Prevent multiple call to initialize
    }
}