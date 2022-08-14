import type { IResource } from '../ILocale';
import { en_US } from './en_US';

export const de_DE: IResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    _: '🇩🇪 Deutsch (DE)',

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'Das Frontend wurde geändert. Jetzt neu starten, um das Frontend zu wechseln?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime und Novel Herunterlader',

    // [SECTION]: Frontend Classic

    Frontend_Classic_Settings_FuzzySearch:'Fuzzy Search',
    Frontend_Classic_Settings_FuzzySearchInfo:'Enable fuzzy search on filters (approximative matching)',
    Frontend_Classic_Settings_Theme: 'Motiv',
    Frontend_Classic_Settings_ThemeInfo: 'Legt das Farbschema der Benutzeroberfläche fest',
    Frontend_Classic_Settings_Theme_HakuNeko: 'HakuNeko',
    Frontend_Classic_Settings_Theme_CarbonWhite: 'Kohlenstoff Weiss',
    Frontend_Classic_Settings_Theme_CarbonG10: 'Kohlenstoff 10% (hell)',
    Frontend_Classic_Settings_Theme_CarbonG90: 'Kohlenstoff 90% (dunkel)',
    Frontend_Classic_Settings_Theme_CarbonG100: 'Kohlenstoff 100% (dunkel)',
    Frontend_Classic_Settings_Theme_SheepyNeko: 'SchäfchenKatze',
    Frontend_Classic_Settings_ContentPanel: 'Inhalts Bereich',
    Frontend_Classic_Settings_ContentPanelInfo: 'Bestimmt ob der Inhaltsbereich ein- oder ausgebelendet ist',
    Frontend_Classic_Settings_ViewerMode: 'Lese Modus',
    Frontend_Classic_Settings_ViewerModeInfo: 'Bestimmt wie die Seiten/Bilder angezeigt werden',
    Frontend_Classic_Settings_ViewerMode_Paginated: 'Seiten (Manga)',
    Frontend_Classic_Settings_ViewerMode_Longstrip: 'Nahtlos (Webtoon)',
    Frontend_Classic_Settings_ViewerReverseDirection: 'Invertierte Leserichtung',
    Frontend_Classic_Settings_ViewerReverseDirectionInfo: 'Zeigt die Seiten/Bilder in umgekehrter Reihenfolge an (wie in klassischen Mangas)',
    Frontend_Classic_Settings_ViewerDoublePage: 'Doppelseitige Ansicht',
    Frontend_Classic_Settings_ViewerDoublePageInfo: 'Zeigt die Seiten/Bilder paarweise an (wie in klassischen Mangas)',

    // [SECTION]: Engine

    Settings_Global_Language: 'Sprache',
    Settings_Global_LanguageInfo: 'Select the language for the user interface',
    Settings_Global_MediaDirectory: 'Media Verzeichnis',
    Settings_Global_MediaDirectoryInfo: 'Select the directory where HakuNeko store the downloads',
    Settings_Global_WebsiteSubDirectory: 'Unterverzeichnisse',
    Settings_Global_WebsiteSubDirectoryInfo: 'Set wether HakuNeko shall store media directly in the directory, or use sub-directories per website',
    Settings_Global_DescramblingFormat: 'Arrangierungs-Format',
    Settings_Global_DescramblingFormatInfo: 'Select the output image format for websites hosting puzzled images (this will NOT apply to wesites already providing valid images)',
    Settings_Global_DescramblingFormat_PNG: 'PNG (*.png)',
    Settings_Global_DescramblingFormat_JPEG: 'JPEG (*.jpg)',
    Settings_Global_DescramblingFormat_WEBP: 'WEBP (*.webp)',
    Settings_Global_DescramblingQuality: 'Arrangierungs-Qualität',
    Settings_Global_DescramblingQualityInfo: 'Set the quality in which de-scrambled images shall be stored (this will NOT apply to PNG)',
    Settings_Global_HCaptchaToken: 'H-Captcha Token',
    Settings_Global_HCaptchaTokenInfo: `Set the accessibility token to automatically bypass websites which use CloudFlare's H-Captcha protection`,
    Settings_Global_PostCommand: 'Post Command',
    Settings_Global_PostCommandInfo: '...',

    SettingsManager_Settings_AlreadyInitializedError: 'Es ist ein interner Fehler in der Anwendung aufgetreten: Die Einstellungen <{0}> dürfen nur einmalig initialisiert werden!',

    FetchProvider_FetchWindow_TimeoutError: 'Die Anfrage konnte nicht innerhalb der angegebenen Zeitbeschränkung verarbeitet werden!',
    FetchProvider_FetchWindow_CloudFlareError: 'Die Anfrage wurde aufgrund des folgenden CloudFlare Fehlers abgebrochen: "{0}"',
    FetchProvider_FetchWindow_AlertCaptcha: 'Um automatisch fortzufahren ist es erforderlich den auf der Website angezeigten Captcha zu lösen (die Webseite darf nach der Lösung nicht geschlossen werde)!',

    // [SECTION]: Tags

    Tags_Media: 'Art',
    Tags_Media_Manga: 'Manga',
    Tags_Media_MangaDescription: 'Japan, Schwarz & Weiss, Einzel-/Doppelseitig, ...',
    Tags_Media_Manhua: 'Manhua',
    Tags_Media_ManhuaDescription: 'China, Farbig, Nahtlos, ...',
    Tags_Media_Manhwa: 'Manhwa',
    Tags_Media_ManhwaDescription: 'Süd Korea, Farbig, Nahtlos, ...',
    Tags_Media_Comic: 'Comic',
    Tags_Media_ComicDescription: 'Westlich, Farbig, ...',
    Tags_Media_Anime: 'Anime',
    Tags_Media_AnimeDescription: 'Anime, ...',
    Tags_Media_Cartoon: 'Cartoon',
    Tags_Media_CartoonDescription: 'Cartoon, ...',
    Tags_Media_Novel: 'Novel',
    Tags_Media_NovelDescription: 'Novel, ...',
    Tags_Source: 'Quelle',
    Tags_Source_Official: 'Official',
    Tags_Source_Scanlator: 'Scanlator',
    Tags_Source_Aggregator: 'Aggregator',
    Tags_Accessibility: 'Zugänglichkeit',
    Tags_Accessibility_RegionLock: 'Länder-Blockade',
    Tags_Accessibility_RegionLockDescription: 'Nur aus bestimmten Ländern zu erreichen (Geo-IP)',
    Tags_Accessibility_RateLimit: 'Download-Drosselung',
    Tags_Accessibility_RateLimitDescription: 'Reduzierte Zugriffsgeschwindigkeit, ggf. IP-Sperre bei Überschreitung',
    Tags_Rating: 'Einstufung',
    Tags_Rating_Safe: 'Keine',
    Tags_Rating_Suggestive: 'Unanständig',
    Tags_Rating_Erotica: 'Erotisch',
    Tags_Rating_Pornographic: 'Pornografisch',
    Tags_Language: 'Sprache',
    Tags_Language_Multilingual: '🌐Multilingual',
    Tags_Language_Arabic: '🇸🇦Arabisch',
    Tags_Language_Chinese: '🇨🇳Chinesisch',
    Tags_Language_English: '🇬🇧Englisch',
    Tags_Language_French: '🇫🇷Französisch',
    Tags_Language_German: '🇩🇪Deutsch',
    Tags_Language_Indonesian: '🇮🇩Indonesisch',
    Tags_Language_Italian: '🇮🇹Italienisch',
    Tags_Language_Japanese: '🇯🇵Japanisch',
    Tags_Language_Korean: '🇰🇷Koreanisch',
    Tags_Language_Polish: '🇵🇱Polnisch',
    Tags_Language_Portuguese: '🇵🇹🇧🇷Portugisisch',
    Tags_Language_Russian: '🇷🇺Russisch',
    Tags_Language_Spanish: '🇪🇸🇦🇷Spanisch',
    Tags_Language_Thai: '🇹🇭Thailändisch',
    Tags_Language_Turkish: '🇹🇷Türkisch',
    Tags_Language_Vietnamese: '🇻🇳Vietnamesisch',
    Tags_Others: 'Weitere',

    // [SECTION]: Plugins

    Plugin_Settings_Throttling: 'Drosselung für Downloads [ms]',
    Plugin_Settings_ThrottlingInfo: '...',

    Plugin_Common_MangasNotSupported: 'Es ist nicht möglich ein Inhaltsverzeichnis für diese Webseite zu erstellen. Verwende die Koieren & Einfügen Funktionalität um direkt auf einzelne Inhalte einer URL zuzugreifen!',

    Plugin_SheepScanlations_Settings_Username: 'Benutzername',
    Plugin_SheepScanlations_Settings_UsernameInfo: 'Benutzername zum automatischen einloggen des Benutzerkontos auf Sheep-Scanlations 😉',
    Plugin_SheepScanlations_Settings_Password: 'Passwort',
    Plugin_SheepScanlations_Settings_PasswordInfo: 'Passwort zum automatischen einloggen des Benutzerkontos auf Sheep-Scanlations 😉',
};