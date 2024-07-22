import { type SettingsManager, Check, Numeric, Text, Secret, Choice, Directory } from './SettingsManager';
import { EngineResourceKey as R, LocaleID } from '../i18n/ILocale';
import type { IFrontendInfo } from '../frontend/IFrontend';
import { Info as InfoClassic } from '../frontend/classic/FrontendInfo';
import { MangaExportFormat } from './exporters/MangaExporterRegistry';

export const Scope = '*';

export const enum Key {
    Frontend = 'frontend',
    Language = 'language',
    MediaDirectory = 'media-directory',
    UseWebsiteSubDirectory = 'website-subdirectory',
    MangaExportFormat = 'manga-export-format',
    DescramblingFormat = 'descrambling-format',
    DescramblingQuality = 'descrambling-quality',
    UserAgent = 'UserAgent',
    CaptchaToken = 'captcha-token',
    PostCommand = 'post-command',
    CheckNewContent = 'check-new-content',
    CheckNewContentPeriod = 'check-new-content-period',
    NotifyNewContent = 'notify-new-content',
    RPCEnabled = 'RPCEnabled',
    RPCPort = 'RPCPort',
    RPCSecret = 'RPCSecret',
}

export async function Initialize(settingsManager: SettingsManager, frontends: IFrontendInfo[]): Promise<void> {
    const settings = settingsManager.OpenScope(Scope);
    await settings.Initialize(
        new Choice(
            Key.Frontend,
            R.Settings_Global_Frontend,
            R.Settings_Global_FrontendInfo,
            InfoClassic.ID,
            ...frontends.map(info => {
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
            Key.MangaExportFormat,
            R.Settings_Global_MangaExportFormat,
            R.Settings_Global_MangaExportFormatInfo,
            MangaExportFormat.RAWs,
            { key: MangaExportFormat.RAWs, label: R.Settings_Global_MangaExportFormat_FolderWithImages },
            { key: MangaExportFormat.CBZ, label: R.Settings_Global_MangaExportFormat_ComicBookArchive },
            { key: MangaExportFormat.EPUB, label: R.Settings_Global_MangaExportFormat_ElectronicPublication },
            { key: MangaExportFormat.PDF, label: R.Settings_Global_MangaExportFormat_PortableDocumentFormat },
        ),
        new Choice(
            Key.DescramblingFormat,
            R.Settings_Global_DescramblingFormat,
            R.Settings_Global_DescramblingFormatInfo,
            'image/png',
            { key: 'image/png', label: R.Settings_Global_Format_PNG },
            { key: 'image/jpeg', label: R.Settings_Global_Format_JPEG },
            { key: 'image/webp', label: R.Settings_Global_Format_WEBP },
        ),
        new Numeric(
            Key.DescramblingQuality,
            R.Settings_Global_DescramblingQuality,
            R.Settings_Global_DescramblingQualityInfo,
            95, 25, 100
        ),
        new Text(
            Key.UserAgent,
            R.Settings_Global_UserAgent,
            R.Settings_Global_UserAgentInfo,
            null
        ),
        new Secret(
            Key.CaptchaToken,
            R.Settings_Global_HCaptchaToken,
            R.Settings_Global_HCaptchaTokenInfo,
            ''
        ),
        new Text(
            Key.PostCommand,
            R.Settings_Global_PostCommand,
            R.Settings_Global_PostCommandInfo,
            ''
        ),
        new Check(
            Key.CheckNewContent,
            R.Settings_NewContent_Check,
            R.Settings_NewContent_CheckInfo,
            false
        ),
        new Numeric(
            Key.CheckNewContentPeriod,
            R.Settings_NewContent_CheckPeriod,
            R.Settings_NewContent_CheckPeriodInfo,
            30, 10, 420
        ),
        new Check(
            Key.NotifyNewContent,
            R.Settings_NewContent_Notify,
            R.Settings_NewContent_NotifyInfo,
            false
        ),
        new Check(
            Key.RPCEnabled,
            R.Settings_Global_RPCEnabled,
            R.Settings_Global_RPCEnabledInfo,
            false
        ),
        new Numeric(
            Key.RPCPort,
            R.Settings_Global_RPCPort,
            R.Settings_Global_RPCPortInfo,
            27544, 1024, 65535
        ),
        new Text(
            Key.RPCSecret,
            R.Settings_Global_RPCSecret,
            R.Settings_Global_RPCSecretInfo,
            'Connection#Secret'
        ),
    );
}