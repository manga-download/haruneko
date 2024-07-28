import type { VariantResource } from '../ILocale';
// HACK: Import a reference to the en-US tranlsation itself, so the auto-generated translation files are based on the en-US translation
import enUS from './en_US';

/**
 * Get the en-US translation map, or an empty map in case of a circular (self) reference
 */
function base() {
  try {
    return enUS;
  } catch(error) {
    if(error instanceof ReferenceError) {
      return {};
    } else {
      throw error;
    }
  }
}

const translations: VariantResource = {
  // NOTE: Use defaults for missing translations
  //       => This is just a placeholder to ensure to be included in auto-generated translations (e.g., with crowdin)
  ...(base() as VariantResource),

  // [SECTION]: FrontendController

  FrontendController_Reload_ConfirmNotice: 'A restart is required in order to apply the requested changes.\nAny unsaved changes will be lost and active operations (e.g., downloads) will be aborted!\n\nDo you want to perform a restart now?',

  // [SECTION]: Frontend (Common/Shared)
  Frontend_Product_Title: 'HakuNeko',
  Frontend_Product_Description: 'Manga, Anime and Novel Downloader',
  Frontend_Setting: 'Setting',
  Frontend_Settings: 'Settings',
  Frontend_Help: 'Help',
  Frontend_About: 'About',
  Frontend_Plugin: 'Plugin',
  Frontend_Plugins: 'Plugins',
  Frontend_Plugin_List: 'Plugin list',
  Frontend_Plugin_Select: 'Select a plugin',
  Frontend_Plugin_Selection: 'Plugin selection',
  Frontend_Media: 'Media',
  Frontend_Medias: 'Media',
  Frontend_Media_List: 'Media list',
  Frontend_Media_Select: 'Select a media',
  Frontend_Media_Selection: 'Media selection',
  Frontend_Media_PasteLink_NotFoundError: 'The provided link is not supported (a matching website was not found): {0}',
  Frontend_Item: 'Item',
  Frontend_Items: 'items',
  Frontend_Item_List: 'Item list',
  Frontend_Item_Select: 'Select an item',
  Frontend_Item_Selection: 'Item selection',

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
  Frontend_Classic_Settings_SidenavTrail: 'Enable sidenav trail',
  Frontend_Classic_Settings_SidenavTrailInfo: 'Left sidenav will only appear on top left icon click',
  Frontend_Classic_Settings_SidenavIconsOnTop: 'Menu icons on top',
  Frontend_Classic_Settings_SidenavIconsOnTopInfo: 'Home and plugins buttons will appear on top instead of sidenav.',
  Frontend_Classic_Settings_ViewerMode: 'Viewer Mode',
  Frontend_Classic_Settings_ViewerModeInfo: 'Change how pages/images will be shown in the reader',
  Frontend_Classic_Settings_ViewerMode_Paginated: 'Paginated (Manga)',
  Frontend_Classic_Settings_ViewerMode_Longstrip: 'Longstrip (Webtoon)',
  Frontend_Classic_Settings_ViewerReverseDirection: 'Invert Reading Direction',
  Frontend_Classic_Settings_ViewerReverseDirectionInfo: 'Show pages/images in reverse order (like in tradional Manga)',
  Frontend_Classic_Settings_ViewerDoublePage: 'Show Double Pages',
  Frontend_Classic_Settings_ViewerDoublePageInfo: 'Show two pages/images at once (like in tradional Manga)',
  Frontend_Classic_Sidenav_Home: 'Home',
  Frontend_Classic_Sidenav_Settings_General: 'General',
  Frontend_Classic_Sidenav_Settings_Interface: 'Interface',
  Frontend_Classic_Sidenav_Settings_Trackers: 'Trackers',
  Frontend_Classic_Sidenav_Settings_Network: 'Network',

  // [SECTION]: Frontend FluentCore

  Frontend_FluentCore_Label: 'Fluent Core',
  Frontend_FluentCore_Description: 'A simple frontend with no bells and whistles, especially for developers to quickly verify essential functionality',
  //
  Frontend_FluentCore_Window_ButtonMinimize_Description: 'Minimize the application',
  Frontend_FluentCore_Window_ButtonMaximize_Description: 'Maximize the application',
  Frontend_FluentCore_Window_ButtonRestore_Description: 'Restore the application',
  Frontend_FluentCore_Window_ButtonClose_Description: 'Close the application',
  //
  Frontend_FluentCore_Menu_Description: 'Show the application menu',
  Frontend_FluentCore_Menu_OpenSettings_Label: 'Settings…',
  Frontend_FluentCore_Menu_OpenSettings_Description: 'Edit the application settings',
  Frontend_FluentCore_Menu_ImportBookmarks_Label: 'Import Bookmarks…',
  Frontend_FluentCore_Menu_ImportBookmarks_Description: 'Import all bookmarks from a file (existing bookmarks will be kept)',
  Frontend_FluentCore_Menu_ExportBookmarks_Label: 'Export Bookmarks…',
  Frontend_FluentCore_Menu_ExportBookmarks_Description: 'Export all bookmarks to a file (e.g., for backup)',
  //
  Frontend_FluentCore_Settings_ThemeLuminance_Label: 'Theme Luminance',
  Frontend_FluentCore_Settings_ThemeLuminance_Description: 'Change the lightness/darkness of the theme',
  Frontend_FluentCore_Settings_ShowBookmarksPanel_Label: 'Bookmark List',
  Frontend_FluentCore_Settings_ShowBookmarksPanel_Description: 'Toggle the visibility of the bookmark list on/off',
  Frontend_FluentCore_Settings_ShowDownloadsPanel_Label: 'Download Manager',
  Frontend_FluentCore_Settings_ShowDownloadsPanel_Description: 'Toggle the visibility of the download manager on/off',
  //
  Frontend_FluentCore_SettingsDialog_Title: 'Settings',
  Frontend_FluentCore_SettingsDialog_CloseButton_Label: 'Done',
  //
  Frontend_FluentCore_BookmarkList_Heading: 'Bookmarks',
  //
  Frontend_FluentCore_DownloadManager_Heading: 'Downloads',
  Frontend_FluentCore_DownloadManagerTask_StatusQueued_Description: 'Queued',
  Frontend_FluentCore_DownloadManagerTask_StatusPaused_Description: 'Paused',
  Frontend_FluentCore_DownloadManagerTask_StatusDownloading_Description: 'Downloading',
  Frontend_FluentCore_DownloadManagerTask_StatusProcessing_Description: 'Processing',
  Frontend_FluentCore_DownloadManagerTask_StatusFailed_Description: 'Failed',
  Frontend_FluentCore_DownloadManagerTask_StatusCompleted_Description: 'Completed',
  Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description: 'Remove this task from the list',
  //
  Frontend_FluentCore_WebsiteSelect_Description: 'Select a website from the list of available websites',
  Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description: 'Click to fetch the list of all available titles from the website,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_WebsiteSelect_BusyStatus_Description: 'Fetching the list of all available titles,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description: 'Star this website (mark as favorite)',
  Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description: 'Unstar this website (unmark as favorite)',
  Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description: 'Edit the settings for this website',
  Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder: '',
  //
  Frontend_FluentCore_MediaTitleSelect_Description: 'Select a media title from the list of available media titles',
  Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description: 'Click to fetch the list of all available chapters/episodes from the website,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_MediaTitleSelect_BusyStatus_Description: 'Fetching the list of all available chapters/episodes,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description: 'Add this title to the bookmark list',
  Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description: 'Remove this title from the bookmarks list',
  Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description: 'Detect the title from the link currently copied in the clipboard',
  Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder: '',
  //
  Frontend_FluentCore_MediaItemList_Heading: 'Media Items',
  Frontend_FluentCore_MediaItemList_PreviewButton_Description: 'Show content',
  Frontend_FluentCore_MediaItemList_DownloadButton_Description: 'Download content',
  //
  Frontend_FluentCore_Preview_CloseButton_Description: 'Close preview',
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
  Settings_Global_MediaDirectory_UnsetError: 'No download directory selected in HakuNeko settings!',
  Settings_Global_MediaDirectory_PermissionError: 'Insufficient permission to acces the download directory!',
  Settings_Global_WebsiteSubDirectory: 'Use Sub-Directories',
  Settings_Global_WebsiteSubDirectoryInfo: 'Set wether HakuNeko shall store media directly in the directory, or use sub-directories per website',
  Settings_Global_MangaExportFormat: 'Manga/Comic Download Format',
  Settings_Global_MangaExportFormatInfo: 'The container format to store the downloaded content for mangas/comics',
  Settings_Global_MangaExportFormat_FolderWithImages: 'Folder with Images',
  Settings_Global_MangaExportFormat_ComicBookArchive: 'Comic Book Archive (*.cbz)',
  Settings_Global_MangaExportFormat_ElectronicPublication: 'E-Book Publication (*.epub)',
  Settings_Global_MangaExportFormat_PortableDocumentFormat: 'Portable Document Format (*.pdf)',
  Settings_Global_DescramblingFormat: 'De-Scrambling Format',
  Settings_Global_DescramblingFormatInfo: 'Select the output image format for websites hosting puzzled images (this will NOT apply to wesites already providing valid images)',
  Settings_Global_DescramblingQuality: 'De-Scrambling Quality',
  Settings_Global_DescramblingQualityInfo: 'Set the quality in which de-scrambled images shall be stored (this will NOT apply to PNG)',
  Settings_Global_Format_PNG: 'PNG (*.png)',
  Settings_Global_Format_JPEG: 'JPEG (*.jpg)',
  Settings_Global_Format_WEBP: 'WEBP (*.webp)',
  Settings_Global_UserAgent: 'User-Agent',
  Settings_Global_UserAgentInfo: 'The User-Agent that HakuNeko will be pretend to be for each website request (leave blank to use default)',
  Settings_Global_HCaptchaToken: 'H-Captcha Token',
  Settings_Global_HCaptchaTokenInfo: `Set the accessibility token to automatically bypass websites which use CloudFlare's H-Captcha protection`,
  Settings_Global_PostCommand: 'Post Command',
  Settings_Global_PostCommandInfo: '...',
  Settings_NewContent_Check: 'Enable new content checker',
  Settings_NewContent_CheckInfo: 'Will check if there are new content to available to read',
  Settings_NewContent_CheckPeriod: 'Check new content period (minutes)',
  Settings_NewContent_CheckPeriodInfo: 'How many minutes before checking again for new content',
  Settings_NewContent_Notify: 'Enable new content desktop notification',
  Settings_NewContent_NotifyInfo: 'Will send a notification using the OS notification system',
  Settings_Global_RPCEnabled: 'Enable RPC',
  Settings_Global_RPCEnabledInfo: 'Enable access for comaptible 3rd-party applications to this HakuNeko instance (e.g., HakuNeko Assistant)',
  Settings_Global_RPCPort: 'RPC Port',
  Settings_Global_RPCPortInfo: 'The communication port to be used by compatible 3rd-party applications to interact with this HakuNeko instance (e.g., HakuNeko Assistant)',
  Settings_Global_RPCSecret: 'RPC Secret',
  Settings_Global_RPCSecretInfo: 'The passphrase required by compatible 3rd-party applications to interact with this HakuNeko instance (e.g., HakuNeko Assistant)',
  //
  Settings_FeatureFlags_Label: 'Feature Flags',
  Settings_FeatureFlags_Description: 'Advanced/Experimental options especially for HakuNeko developers, contributors and power users',
  Settings_FeatureFlags_ShowSplashScreen_Label: 'Show Splash Screen',
  Settings_FeatureFlags_ShowSplashScreen_Description: 'Toggle the splash screen during application start on/off',
  Settings_FeatureFlags_ShowFetchBrowserWindows_Label: 'Show FetchBrowser Windows',
  Settings_FeatureFlags_ShowFetchBrowserWindows_Description: 'This developer focused option toggles the visibility of the browser windows for fetching data in the background on/off',
  Settings_FeatureFlags_CrowdinTranslationMode_Label: 'Enable In-Context Translation',
  Settings_FeatureFlags_CrowdinTranslationMode_Description: 'This contributor focused option toggles the localization mode for Crowdin In-Context translation on/off (Crowdin account + restart required)',
  //
  SettingsManager_Settings_AlreadyInitializedError: 'An internal application error occured: The settings scope <{0}> must only be initialized once!',
  //
  FetchProvider_FetchGraphQL_AggregateError: 'The request failed due to the following GraphQL error(s):\n{0}',
  FetchProvider_FetchGraphQL_MissingDataError: 'The request failed due to missing GraphQL response data!',
  FetchProvider_FetchWindow_TimeoutError: 'The request could not be fulfilled within the given timeout!',
  FetchProvider_FetchWindow_CloudFlareError: 'The request failed due to the following CloudFlare Error: "{0}"',
  FetchProvider_FetchWindow_AlertCaptcha: 'Please solve the Captcha and then wait for the application to continue (do not close the website after solving the Captcha)!',
  FetchProvider_Fetch_CloudFlareChallenge: 'The request to "{0}" was rejected by CloudFlare Anti-Bot detection.\nMake sure to bypass CloudFlare before accessing the content of this website (e.g., with the HakuNeko Assistant browser extension).',
  FetchProvider_Fetch_Forbidden: 'The access to "{0}" was denied.\nMake sure the website is available and accessible (e.g., VPN to bypass region lock, manual login via website link).',
  //
  BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError: 'The provided data seems to be invalid/corrupted and could not be successfully de-serialized to a bookmark!',

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
  Tags_Language_Multilingual: '🌐 Multilingual',
  Tags_Language_Arabic: '🇸🇦 Arabic',
  Tags_Language_Chinese: '🇨🇳 Chinese',
  Tags_Language_English: '🇬🇧 English',
  Tags_Language_French: '🇫🇷 French',
  Tags_Language_German: '🇩🇪 German',
  Tags_Language_Indonesian: '🇮🇩 Indonesian',
  Tags_Language_Italian: '🇮🇹 Italian',
  Tags_Language_Japanese: '🇯🇵 Japanese',
  Tags_Language_Korean: '🇰🇷 Korean',
  Tags_Language_Polish: '🇵🇱 Polish',
  Tags_Language_Portuguese: '🇵🇹🇧🇷 Portuguese',
  Tags_Language_Russian: '🇷🇺 Russian',
  Tags_Language_Spanish: '🇪🇸🇦🇷 Spanish',
  Tags_Language_Thai: '🇹🇭 Thai',
  Tags_Language_Turkish: '🇹🇷 Turkish',
  Tags_Language_Vietnamese: '🇻🇳 Vietnamese',
  Tags_Others: 'Others',

  // [SECTION]: Annotations

  Annotations_ViewProgress: 'Progress',
  Annotations_ViewProgressDescription: 'A custom status indicating the reading/viewing progression',
  Annotations_ViewProgress_None: '-',
  Annotations_ViewProgress_NoneDescription: 'Not yet read/viewed',
  Annotations_ViewProgress_Viewed: 'x',
  Annotations_ViewProgress_ViewedDescription: 'Already read/viewed',
  Annotations_ViewProgress_Current: 'o',
  Annotations_ViewProgress_CurrentDescription: 'Currently reading/viewing',

  // [SECTION]: Trackers

  Tracker_Kitsu_Settings_Username: 'Username',
  Tracker_Kitsu_Settings_UsernameInfo: 'Username for automatic account login to Kitsu',
  Tracker_Kitsu_Settings_Password: 'Password',
  Tracker_Kitsu_Settings_PasswordInfo: 'Password for automatic account login to Kitsu',

  // [SECTION]: Plugins (common)

  Plugin_Settings_ThrottlingDownloads: 'Throttle Downloads [ms]',
  Plugin_Settings_ThrottlingDownloadsInfo: '...',
  Plugin_Settings_ThrottlingInteraction: 'Interaction Rate Limit [requests/minute]',
  Plugin_Settings_ThrottlingInteractionInfo: 'Limit the number of requests to this website to prevent being blocked or banned',

  Plugin_Settings_UrlOverride: 'Url Override',
  Plugin_Settings_UrlOverrideInfo: 'Use this URL as current domain for this website',

  Plugin_Settings_ImageFormat: 'Preferred Image Format',
  Plugin_Settings_ImageFormatInfo: 'Download pictures using this file format if possible',

  Plugin_Common_MangaIndex_NotSupported: 'Unable to create the content index for this website. Use the Copy & Paste feature to directly access the content of a specific URL!',
  Plugin_Common_Chapter_UnavailableError: 'The chapter is not available (not purchased/unlocked/public)!',
  Plugin_Common_Chapter_InvalidError: 'Failed to extract the pages from the chapter content!',
  Plugin_Common_Preferred_Language: 'Preferred Language for the website',
  Plugin_Common_Preferred_LanguageInfo: 'Preferred language for website content.',

  Plugin_MissingWebsite_UpdateError: 'Failed to update the content index for a non-existing website!',
  Plugin_MissingWebsiteEntry_UpdateError: 'Failed to update the media index for a non-existing website!',

  // [SECTION]: Plugins (specific)

  Plugin_CopyManga_Settings_GlobalCDN: 'Use Global CDN',
  Plugin_CopyManga_Settings_GlobalCDNInfo: 'Requesting from the Global CDN',

  Plugin_PocketComics_LanguageMismatchError: 'Unable to find manga {0} for selected language {1}',

  Plugin_SheepScanlations_Settings_Username: 'Username',
  Plugin_SheepScanlations_Settings_UsernameInfo: 'Username for automatic account login to Sheep-Scanlations 😉',
  Plugin_SheepScanlations_Settings_Password: 'Password',
  Plugin_SheepScanlations_Settings_PasswordInfo: 'Password for automatic account login to Sheep-Scanlations 😉',
};

export default translations;