import { SettingsManager, Check, Numeric, Text, Secret, Choice, Directory } from './SettingsManager';
import { Code, ResourceKey as R } from '../i18n/ILocale';

export const Scope = '*';

export const enum Key {
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
            Key.Language,
            R.Settings_Global_Language,
            R.Settings_Global_LanguageInfo,
            Code.en_US,
            { key: Code.en_US, label: R.Settings_Global_Language_enUS },
            { key: Code.fr_FR, label: R.Settings_Global_Language_frFR },
            { key: Code.de_DE, label: R.Settings_Global_Language_deDE },
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