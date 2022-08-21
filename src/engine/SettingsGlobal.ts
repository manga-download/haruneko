import { type SettingsManager, Check, Numeric, Text, Secret, Choice, Directory } from './SettingsManager';
import { VariantResourceKey as R, LocaleID } from '../i18n/ILocale';
import { FrontendList } from '../frontend/FrontendController';
import { Info as InfoClassic } from '../frontend/classic/FrontendInfo';

export const Scope = '*';

export const enum Key {
    Frontend = 'frontend',
    Language = 'language',
    MediaDirectory = 'media-directory',
    UseWebsiteSubDirectory = 'website-subdirectory',
    DescramblingFormat = 'descrambling-format',
    DescramblingQuality = 'descrambling-quality',
    CaptchaToken = 'captcha-token',
    PostCommand = 'post-command',
}

export async function Initialize(settingsManager: SettingsManager): Promise<void> {
    const settings = settingsManager.OpenScope(Scope);
    await settings.Initialize(
        new Choice(
            Key.Frontend,
            R.Settings_Global_Frontend,
            R.Settings_Global_FrontendInfo,
            InfoClassic.ID,
            ...FrontendList.map(info => {
                return { key: info.ID, label: info.Label /* description: info.Description */ };
            })
        ),
        new Choice(
            Key.Language,
            R.Settings_Global_Language,
            R.Settings_Global_LanguageInfo,
            LocaleID.Locale_enUS,
            ...Object.entries(LocaleID).map(([key, label]) => {
                return { key, label };
            })
        ),
        new Directory(
            Key.MediaDirectory,
            R.Settings_Global_MediaDirectory,
            R.Settings_Global_MediaDirectoryInfo,
            null
        ),
        new Check(
            Key.UseWebsiteSubDirectory,
            R.Settings_Global_WebsiteSubDirectory,
            R.Settings_Global_WebsiteSubDirectoryInfo,
            false
        ),
        new Choice(
            Key.DescramblingFormat,
            R.Settings_Global_DescramblingFormat,
            R.Settings_Global_DescramblingFormatInfo,
            'image/png',
            { key: 'image/png', label: R.Settings_Global_DescramblingFormat_PNG },
            { key: 'image/jpeg', label: R.Settings_Global_DescramblingFormat_JPEG },
            { key: 'image/webp', label: R.Settings_Global_DescramblingFormat_WEBP },
        ),
        new Numeric(
            Key.DescramblingQuality,
            R.Settings_Global_DescramblingQuality,
            R.Settings_Global_DescramblingQualityInfo,
            95, 25, 100
        ),
        new Secret(
            Key.CaptchaToken,
            R.Settings_Global_HCaptchaToken,
            R.Settings_Global_HCaptchaTokenInfo,
            ''
        ),
        new Text(
            Key.PostCommand,
            R.Settings_Global_PostCommandInfo,
            R.Settings_Global_PostCommandInfo,
            ''
        )
    );
}