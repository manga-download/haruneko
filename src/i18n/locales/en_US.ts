import type { IVariantResource } from '../ILocale';

export const en_US: IVariantResource = {

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'The frontend was changed. Restart now to switch to the new frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime and Novel Downloader',

    // [SECTION]: Frontend Classic

    Frontend_Classic_Label: 'Classic',
    Frontend_Classic_Description: 'The standard frontend mostly based on the previous version',
    Frontend_Classic_Settings_FuzzySearch: 'Fuzzy Search',
    Frontend_Classic_Settings_FuzzySearchInfo: 'Enable fuzzy search on filters (approximative matching)',
    Frontend_Classic_Settings_Theme: 'Theme',
    Frontend_Classic_Settings_ThemeInfo: 'Select the color theme for the user interface',
    Frontend_Classic_Settings_Theme_HakuNeko: 'HakuNeko',
    Frontend_Classic_Settings_Theme_CarbonWhite: 'Carbon White',
    Frontend_Classic_Settings_Theme_CarbonG10: 'Carbon g10 (light)',
    Frontend_Classic_Settings_Theme_CarbonG90: 'Carbon g90 (dark)',
    Frontend_Classic_Settings_Theme_CarbonG100: 'Carbon g100 (dark)',
    Frontend_Classic_Settings_Theme_SheepyNeko: 'SheepyNeko',
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

    // [SECTION]: Frontend FluentCore

    Frontend_FluentCore_Label: 'Fluent Core',
    Frontend_FluentCore_Description: 'A simple frontend with no bells and whistles, especially for developers to quickly verify essential functionality',
    //
    Frontend_FluentCore_Settings_ThemeLuminance_Label: 'Theme Luminance',
    Frontend_FluentCore_Settings_ThemeLuminance_Description: 'Change the lightness/darkness of the theme',
    Frontend_FluentCore_Settings_ShowBookmarksPanel_Label: 'Bookmark List',
    Frontend_FluentCore_Settings_ShowBookmarksPanel_Description: 'Toggle the visibility of the bookmark list',
    Frontend_FluentCore_Settings_ShowDownloadsPanel_Label: 'Download Manager',
    Frontend_FluentCore_Settings_ShowDownloadsPanel_Description: 'Toggle the visibility of the download manager',
    //
    Frontend_FluentCore_Menu_OpenSettings_Label: 'Settings...',
    Frontend_FluentCore_Menu_OpenSettings_Description: 'Edit the application settings',
    Frontend_FluentCore_Menu_ImportBookmarks_Label: 'Import Bookmarks...',
    Frontend_FluentCore_Menu_ImportBookmarks_Description: 'Open the dialog to import bookmarks from previous version(s)',
    //
    Frontend_FluentCore_SettingsDialog_Title: 'Settings',
    Frontend_FluentCore_SettingsDialog_CloseButton_Label: 'Done',
    //
    Frontend_FluentCore_Panel_BookmarkList_Heading: 'Bookmarks',
    Frontend_FluentCore_Panel_DownloadManager_Heading: 'Downloads',
    Frontend_FluentCore_Panel_MediaItems_Heading: 'Media Items',
    //
    Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description: 'Click to fetch the list of all available titles from the website,\ndepending on the number of required requests this may take a while',
    Frontend_FluentCore_WebsiteSelect_BusyStatus_Description: 'Fetching the list of all available titles,\ndepending on the number of required requests this may take a while',
    Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description: 'Star this website (mark as favorite)',
    Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description: 'Unstar this website (unmark as favorite)',
    Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description: 'Edit the settings for this website',
    Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder: '',
    //
    Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description: 'Click to fetch the list of all available chapters/episodes from the website,\ndepending on the number of required requests this may take a while',
    Frontend_FluentCore_MediaTitleSelect_BusyStatus_Description: 'Fetching the list of all available chapters/episodes,\ndepending on the number of required requests this may take a while',
    Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description: 'Add this title to the bookmark list',
    Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description: 'Remove this title from the bookmarks list',
    Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description: 'Detect the title from the link currently copied in the clipboard',
    Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder: '',
    //
    Frontend_FluentCore_MediaItemList_PreviewButton_Description: 'Show content',
    Frontend_FluentCore_MediaItemList_DownloadButton_Description: 'Download content',
    //
    Frontend_FluentCore_SearchBox_ClearButton_Description: 'Clear the current search pattern',
    Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description: 'Toggle between case sensitive and insensitive mode',
    Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description: 'Toggle between text and regular expression mode',

    // [SECTION]: Engine

    Settings_Global_Frontend: 'Frontend',
    Settings_Global_FrontendInfo: 'Select the user interface (restart required)',
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

    // [SECTION]: Tags

    Tags_Media: 'Media',
    Tags_Media_Manga: 'Manga',
    Tags_Media_MangaDescription: 'Japan, Black & White, Single/Double Paged, ...',
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
    Tags_Source: 'Source',
    Tags_Source_Official: 'Official',
    Tags_Source_Scanlator: 'Scanlator',
    Tags_Source_Aggregator: 'Aggregator',
    Tags_Accessibility: 'Accessibility',
    Tags_Accessibility_RegionLock: 'Region-Lock',
    Tags_Accessibility_RegionLockDescription: 'Access only for unlocked countries (Geo-IP)',
    Tags_Accessibility_RateLimit: 'Rate-Limit',
    Tags_Accessibility_RateLimitDescription: 'Limited download speed, IP may be blocked when exceeded',
    Tags_Rating: 'Rating',
    Tags_Rating_Safe: 'Safe',
    Tags_Rating_Suggestive: 'Suggestive',
    Tags_Rating_Erotica: 'Erotica',
    Tags_Rating_Pornographic: 'Pornographic',
    Tags_Language: 'Language',
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
    Tags_Others: 'Others',

    // [SECTION]: Trackers

    Tracker_Kitsu_Settings_Username: 'Username',
    Tracker_Kitsu_Settings_UsernameInfo: 'Username for automatic account login to Kitsu',
    Tracker_Kitsu_Settings_Password: 'Password',
    Tracker_Kitsu_Settings_PasswordInfo: 'Password for automatic account login to Kitsu',

    // [SECTION]: Plugins

    Plugin_Settings_Throttling: 'Throttle Downloads [ms]',
    Plugin_Settings_ThrottlingInfo: '...',

    Plugin_Common_MangasNotSupported: 'Unable to create the content index for this website. Use the Copy & Paste feature to directly access the content of a specific URL!',

    Plugin_SheepScanlations_Settings_Username: 'Username',
    Plugin_SheepScanlations_Settings_UsernameInfo: 'Username for automatic account login to Sheep-Scanlations 😉',
    Plugin_SheepScanlations_Settings_Password: 'Password',
    Plugin_SheepScanlations_Settings_PasswordInfo: 'Password for automatic account login to Sheep-Scanlations 😉',
};