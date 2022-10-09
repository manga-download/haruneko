import type { IVariantResource } from '../ILocale';
import { en_US } from './en_US';

export const fr_FR: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'The frontend was changed. Restart now to switch to the new frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime et Novel Téléchargeur',

    // [SECTION]: Frontend Classic

    Frontend_Classic_Settings_FuzzySearch: 'Fuzzy Search',
    Frontend_Classic_Settings_FuzzySearchInfo: 'Enable fuzzy search on filters (approximative matching)',
    Frontend_Classic_Settings_Theme: 'Theme',
    Frontend_Classic_Settings_ThemeInfo: 'Select the color theme for the user interface',
    Frontend_Classic_Settings_Theme_HakuNeko: 'HakuNeko',
    Frontend_Classic_Settings_Theme_CarbonWhite: 'Carbone Blanc',
    Frontend_Classic_Settings_Theme_CarbonG10: 'Carbone g10 (brillant)',
    Frontend_Classic_Settings_Theme_CarbonG90: 'Carbone g90 (sombre)',
    Frontend_Classic_Settings_Theme_CarbonG100: 'Carbone g100 (sombre)',
    Frontend_Classic_Settings_Theme_SheepyNeko: 'AgneauChat',
    Frontend_Classic_Settings_ContentPanel: 'Content Panel',
    Frontend_Classic_Settings_ContentPanelInfo: 'Set to show/hide the content panel',
    Frontend_Classic_Settings_ViewerMode: 'Viewer Mode',
    Frontend_Classic_Settings_ViewerModeInfo: 'Change how pages/images will be shown in the reader',
    Frontend_Classic_Settings_ViewerMode_Paginated: 'Paginated (Manga)',
    Frontend_Classic_Settings_ViewerMode_Longstrip: 'Longstrip (Webtoon)',
    Frontend_Classic_Settings_ViewerReverseDirection: 'Invert Reading Direction',
    Frontend_Classic_Settings_ViewerReverseDirectionInfo: 'Show pages/images in reverse order (like in tradional Manga)',
    Frontend_Classic_Settings_ViewerDoublePage: 'Show Double Pages',
    Frontend_Classic_Settings_ViewerDoublePageInfo: 'Show two pages/images at once (like in tradional Manga)',

    // [SECTION]: Engine

    Settings_Global_Language: 'Language',
    Settings_Global_LanguageInfo: 'Select the language for the user interface',
    Settings_Global_MediaDirectory: 'Media Directory',
    Settings_Global_MediaDirectoryInfo: 'Select the directory where HakuNeko store the downloads',
    Settings_Global_WebsiteSubDirectory: 'Use Sub-Directories',
    Settings_Global_WebsiteSubDirectoryInfo: 'Set wether HakuNeko shall store media directly in the directory, or use sub-directories per website',
    Settings_Global_DescramblingFormat: 'De-Scrambling Format',
    Settings_Global_DescramblingFormatInfo: 'Select the output image format for websites hosting puzzled images (this will NOT apply to wesites already providing valid images)',
    Settings_Global_DescramblingFormat_PNG: 'PNG (*.png)',
    Settings_Global_DescramblingFormat_JPEG: 'JPEG (*.jpg)',
    Settings_Global_DescramblingFormat_WEBP: 'WEBP (*.webp)',
    Settings_Global_DescramblingQuality: 'De-Scrambling Quality',
    Settings_Global_DescramblingQualityInfo: 'Set the quality in which de-scrambled images shall be stored (this will NOT apply to PNG)',
    Settings_Global_HCaptchaToken: 'H-Captcha Token',
    Settings_Global_HCaptchaTokenInfo: `Set the accessibility token to automatically bypass websites which use CloudFlare's H-Captcha protection`,
    Settings_Global_PostCommand: 'Post Command',
    Settings_Global_PostCommandInfo: '...',

    SettingsManager_Settings_AlreadyInitializedError: 'An internal application error occured: The settings scope <{0}> must only be initialized once!',

    FetchProvider_FetchWindow_TimeoutError: 'The request could not be fulfilled within the given timeout!',
    FetchProvider_FetchWindow_CloudFlareError: 'The request failed due to the following CloudFlare Error: "{0}"',
    FetchProvider_FetchWindow_AlertCaptcha: 'Please solve the Captcha and then wait for the application to continue (do not close the website after solving the Captcha)!',

    Settings_NewContent_Check: 'Enable new content checker',
    Settings_NewContent_CheckInfo: 'Will check if there are new content to available to read',
    Settings_NewContent_CheckPeriod: 'Period to check new content (minutes)',
    Settings_NewContent_CheckPeriodInfo: 'How many minutes before checking again for new content',
    Settings_NewContent_Notify: 'Enable new content desktop notification',
    Settings_NewContent_NotifyInfo: 'Will send a notification using the OS notification system',

    // [SECTION]: Tags

    Tags_Media: 'Gentil',
    Tags_Media_Manga: 'Manga',
    Tags_Media_MangaDescription: 'Japan, Noir & Blanc, Single/Double Paged, ...',
    Tags_Media_Manhua: 'Manhua',
    Tags_Media_ManhuaDescription: 'China, Colored, Longstrip, ...',
    Tags_Media_Manhwa: 'Manhwa',
    Tags_Media_ManhwaDescription: 'South Korea, Colored, Longstrip, ...',
    Tags_Media_Comic: 'Comic',
    Tags_Media_ComicDescription: 'Western, Colored, ...',
    Tags_Media_Anime: 'Anime',
    Tags_Media_AnimeDescription: 'Anime, ...',
    Tags_Media_Cartoon: 'Cartoon',
    Tags_Media_CartoonDescription: 'Cartoon, ...',
    Tags_Media_Novel: 'Novel',
    Tags_Media_NovelDescription: 'Novel, ...',
    Tags_Source: 'Fournisseur',
    Tags_Source_Official: 'Official',
    Tags_Source_Scanlator: 'Scanlator',
    Tags_Source_Aggregator: 'Aggregator',
    Tags_Accessibility: 'Accessibility',
    Tags_Accessibility_RegionLock: 'Region-Lock',
    Tags_Accessibility_RegionLockDescription: 'Access only for unlocked countries (Geo-IP)',
    Tags_Accessibility_RateLimit: 'Rate-Limit',
    Tags_Accessibility_RateLimitDescription: 'Limited download speed, IP may be blocked when exceeded',
    Tags_Rating: 'Notation',
    Tags_Rating_Safe: 'Safe',
    Tags_Rating_Suggestive: 'Suggestive',
    Tags_Rating_Erotica: 'Erotica',
    Tags_Rating_Pornographic: 'Pornographic',
    Tags_Language: 'Langauge',
    Tags_Language_Multilingual: '🌐Multilingual',
    Tags_Language_Arabic: '🇸🇦Arabic',
    Tags_Language_Chinese: '🇨🇳Chinese',
    Tags_Language_English: '🇬🇧English',
    Tags_Language_French: '🇫🇷French',
    Tags_Language_German: '🇩🇪German',
    Tags_Language_Indonesian: '🇮🇩Indonesian',
    Tags_Language_Italian: '🇮🇹Italian',
    Tags_Language_Japanese: '🇯🇵Japanese',
    Tags_Language_Korean: '🇰🇷Korean',
    Tags_Language_Polish: '🇵🇱Polish',
    Tags_Language_Portuguese: '🇵🇹🇧🇷Portuguese',
    Tags_Language_Russian: '🇷🇺Russian',
    Tags_Language_Spanish: '🇪🇸🇦🇷Spanish',
    Tags_Language_Thai: '🇹🇭Thai',
    Tags_Language_Turkish: '🇹🇷Turkish',
    Tags_Language_Vietnamese: '🇻🇳Vietnamese',
    Tags_Others: 'Autrui',

    // [SECTION]: Plugins

    Plugin_Settings_Throttling: 'Throttle Downloads [ms]',
    Plugin_Settings_ThrottlingInfo: '...',

    Plugin_Common_MangasNotSupported: 'Unable to acquire the content index for this website. Use the Copy & Paste feature to directly access the content of a specific URL!',

    Plugin_SheepScanlations_Settings_Username: 'Username',
    Plugin_SheepScanlations_Settings_UsernameInfo: 'Username for automatic account login to Sheep-Scanlations 😉',
    Plugin_SheepScanlations_Settings_Password: 'Password',
    Plugin_SheepScanlations_Settings_PasswordInfo: 'Password for automatic account login to Sheep-Scanlations 😉',
};