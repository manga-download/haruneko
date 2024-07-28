export type IResource = Record<keyof InvariantResource | keyof VariantResource, string>;
export type InvariantResource = Record<keyof typeof InvariantResourceKey, string>;
export type VariantResource = Record<keyof typeof VariantResourceKey, string>;
export type ILocale = Record<keyof IResource, (...params: string[]) => string>;

// ****************************************************************************
/**
 * All pre-defined identifiers that must be independent from the selected locale.
 */
//type InvariantResourceKey = keyof typeof LocaleID;
// ****************************************************************************

// [SECTION]: Locales
export enum LocaleID {
    Locale_arSA = 'Locale_arSA',
    Locale_deDE = 'Locale_deDE',
    Locale_enUS = 'Locale_enUS',
    Locale_esES = 'Locale_esES',
    Locale_filPH = 'Locale_filPH',
    Locale_frFR = 'Locale_frFR',
    Locale_hiIN = 'Locale_hiIN',
    Locale_idID = 'Locale_idID',
    Locale_ptPT = 'Locale_ptPT',
    Locale_thTH = 'Locale_thTH',
    Locale_trTR = 'Locale_trTR',
    Locale_zhCN = 'Locale_zhCN',
}

export const InvariantResourceKey = {
    ...LocaleID,
};

// *****************************************************************************************************
/**
 * All pre-defined identifiers that must be provided by any localization {@link IResource} implementation.
 * Using merged enum for structuring ...
 */
//type VariantResourceKey = TagCategoryResourceKey | TagResourceKey | AnnotationCategoryResourceKey | AnnotationResourceKey | FrontendResourceKey | EngineResourceKey | TrackerResourceKey | WebsiteResourceKey;
// *****************************************************************************************************

// [SECTION]: Tag Categories
export enum TagCategoryResourceKey {
    Tags_Media = 'Tags_Media',
    Tags_Source = 'Tags_Source',
    Tags_Accessibility = 'Tags_Accessibility',
    Tags_Rating = 'Tags_Rating',
    Tags_Language = 'Tags_Language',
    Tags_Others = 'Tags_Others',
}

// [SECTION]: Tags
export enum TagResourceKey {
    Tags_Media_Manga = 'Tags_Media_Manga',
    Tags_Media_MangaDescription = 'Tags_Media_MangaDescription',
    Tags_Media_Manhua = 'Tags_Media_Manhua',
    Tags_Media_ManhuaDescription = 'Tags_Media_ManhuaDescription',
    Tags_Media_Manhwa = 'Tags_Media_Manhwa',
    Tags_Media_ManhwaDescription = 'Tags_Media_ManhwaDescription',
    Tags_Media_Comic = 'Tags_Media_Comic',
    Tags_Media_ComicDescription = 'Tags_Media_ComicDescription',
    Tags_Media_Anime = 'Tags_Media_Anime',
    Tags_Media_AnimeDescription = 'Tags_Media_AnimeDescription',
    Tags_Media_Cartoon = 'Tags_Media_Cartoon',
    Tags_Media_CartoonDescription = 'Tags_Media_CartoonDescription',
    Tags_Media_Novel = 'Tags_Media_Novel',
    Tags_Media_NovelDescription = 'Tags_Media_NovelDescription',
    Tags_Source_Official = 'Tags_Source_Official',
    Tags_Source_Scanlator = 'Tags_Source_Scanlator',
    Tags_Source_Aggregator = 'Tags_Source_Aggregator',
    Tags_Accessibility_RegionLock = 'Tags_Accessibility_RegionLock',
    Tags_Accessibility_RegionLockDescription = 'Tags_Accessibility_RegionLockDescription',
    Tags_Accessibility_RateLimit = 'Tags_Accessibility_RateLimit',
    Tags_Accessibility_RateLimitDescription = 'Tags_Accessibility_RateLimitDescription',
    Tags_Rating_Safe = 'Tags_Rating_Safe',
    Tags_Rating_Suggestive = 'Tags_Rating_Suggestive',
    Tags_Rating_Erotica = 'Tags_Rating_Erotica',
    Tags_Rating_Pornographic = 'Tags_Rating_Pornographic',
    Tags_Language_Multilingual = 'Tags_Language_Multilingual',
    Tags_Language_Arabic = 'Tags_Language_Arabic',
    Tags_Language_Chinese = 'Tags_Language_Chinese',
    Tags_Language_English = 'Tags_Language_English',
    Tags_Language_French = 'Tags_Language_French',
    Tags_Language_German = 'Tags_Language_German',
    Tags_Language_Indonesian = 'Tags_Language_Indonesian',
    Tags_Language_Italian = 'Tags_Language_Italian',
    Tags_Language_Japanese = 'Tags_Language_Japanese',
    Tags_Language_Korean = 'Tags_Language_Korean',
    Tags_Language_Polish = 'Tags_Language_Polish',
    Tags_Language_Portuguese = 'Tags_Language_Portuguese',
    Tags_Language_Russian = 'Tags_Language_Russian',
    Tags_Language_Spanish = 'Tags_Language_Spanish',
    Tags_Language_Thai = 'Tags_Language_Thai',
    Tags_Language_Turkish = 'Tags_Language_Turkish',
    Tags_Language_Vietnamese = 'Tags_Language_Vietnamese',
}

// [SECTION]: Annotation Categories (Custom Tags)
export enum AnnotationCategoryResourceKey {
    Annotations_ViewProgress = 'Annotations_ViewProgress',
}

// [SECTION]: Annotations (Custom Tags)
export enum AnnotationResourceKey {
    Annotations_ViewProgressDescription = 'Annotations_ViewProgressDescription',
    Annotations_ViewProgress_None = 'Annotations_ViewProgress_None',
    Annotations_ViewProgress_NoneDescription = 'Annotations_ViewProgress_NoneDescription',
    Annotations_ViewProgress_Viewed = 'Annotations_ViewProgress_Viewed',
    Annotations_ViewProgress_ViewedDescription = 'Annotations_ViewProgress_ViewedDescription',
    Annotations_ViewProgress_Current = 'Annotations_ViewProgress_Current',
    Annotations_ViewProgress_CurrentDescription = 'Annotations_ViewProgress_CurrentDescription',
}

// [SECTION]: Frontends (Common)
export enum FrontendResourceKey {
    FrontendController_Reload_ConfirmNotice = 'FrontendController_Reload_ConfirmNotice',
    Frontend_Product_Title = 'Frontend_Product_Title',
    Frontend_Product_Description = 'Frontend_Product_Description',
    Frontend_Setting = 'Frontend_Setting',
    Frontend_Settings = 'Frontend_Settings',
    Frontend_Help = 'Frontend_Help',
    Frontend_About= 'Frontend_About',
    Frontend_Plugin = 'Frontend_Plugin',
    Frontend_Plugins = 'Frontend_Plugins',
    Frontend_Plugin_List = 'Frontend_Plugin_List',
    Frontend_Plugin_Select = 'Frontend_Plugin_Select',
    Frontend_Plugin_Selection = 'Frontend_Plugin_Selection',
    Frontend_Media = 'Frontend_Media',
    Frontend_Medias = 'Frontend_Medias',
    Frontend_Media_List = 'Frontend_Media_List',
    Frontend_Media_Select = 'Frontend_Media_Select',
    Frontend_Media_Selection = 'Frontend_Media_Selection',
    Frontend_Media_PasteLink_NotFoundError = 'Frontend_Media_PasteLink_NotFoundError',
    Frontend_Item = 'Frontend_Item',
    Frontend_Items = 'Frontend_Items',
    Frontend_Item_List = 'Frontend_Item_List',
    Frontend_Item_Select = 'Frontend_Item_Select',
    Frontend_Item_Selection = 'Frontend_Item_Selection',
}

// [SECTION]: Frontend: Classic
export enum FrontendResourceKey {
    Frontend_Classic_Label = 'Frontend_Classic_Label',
    Frontend_Classic_Description = 'Frontend_Classic_Description',
    Frontend_Classic_Settings_FuzzySearch = 'Frontend_Classic_Settings_FuzzySearch',
    Frontend_Classic_Settings_FuzzySearchInfo = 'Frontend_Classic_Settings_FuzzySearchInfo',
    Frontend_Classic_Settings_Theme = 'Frontend_Classic_Settings_Theme',
    Frontend_Classic_Settings_ThemeInfo = 'Frontend_Classic_Settings_ThemeInfo',
    Frontend_Classic_Settings_Theme_HakuNeko = 'Frontend_Classic_Settings_Theme_HakuNeko',
    Frontend_Classic_Settings_Theme_CarbonWhite = 'Frontend_Classic_Settings_Theme_CarbonWhite',
    Frontend_Classic_Settings_Theme_CarbonG10 = 'Frontend_Classic_Settings_Theme_CarbonG10',
    Frontend_Classic_Settings_Theme_CarbonG90 = 'Frontend_Classic_Settings_Theme_CarbonG90',
    Frontend_Classic_Settings_Theme_CarbonG100 = 'Frontend_Classic_Settings_Theme_CarbonG100',
    Frontend_Classic_Settings_Theme_SheepyNeko = 'Frontend_Classic_Settings_Theme_SheepyNeko',
    Frontend_Classic_Settings_ContentPanel = 'Frontend_Classic_Settings_ContentPanel',
    Frontend_Classic_Settings_ContentPanelInfo = 'Frontend_Classic_Settings_ContentPanelInfo',
    Frontend_Classic_Settings_SidenavTrail = 'Frontend_Classic_Settings_SidenavTrail',
    Frontend_Classic_Settings_SidenavTrailInfo = 'Frontend_Classic_Settings_SidenavTrailInfo',
    Frontend_Classic_Settings_SidenavIconsOnTop = 'Frontend_Classic_Settings_SidenavIconsOnTop',
    Frontend_Classic_Settings_SidenavIconsOnTopInfo = 'Frontend_Classic_Settings_SidenavIconsOnTopInfo',
    Frontend_Classic_Settings_ViewerMode = 'Frontend_Classic_Settings_ViewerMode',
    Frontend_Classic_Settings_ViewerModeInfo = 'Frontend_Classic_Settings_ViewerModeInfo',
    Frontend_Classic_Settings_ViewerMode_Paginated = 'Frontend_Classic_Settings_ViewerMode_Paginated',
    Frontend_Classic_Settings_ViewerMode_Longstrip = 'Frontend_Classic_Settings_ViewerMode_Longstrip',
    Frontend_Classic_Settings_ViewerReverseDirection = 'Frontend_Classic_Settings_ViewerReverseDirection',
    Frontend_Classic_Settings_ViewerReverseDirectionInfo = 'Frontend_Classic_Settings_ViewerReverseDirectionInfo',
    Frontend_Classic_Settings_ViewerDoublePage = 'Frontend_Classic_Settings_ViewerDoublePage',
    Frontend_Classic_Settings_ViewerDoublePageInfo = 'Frontend_Classic_Settings_ViewerDoublePageInfo',
    Frontend_Classic_Sidenav_Home = 'Frontend_Classic_Sidenav_Home',
    Frontend_Classic_Sidenav_Settings_General = 'Frontend_Classic_Sidenav_Settings_General',
    Frontend_Classic_Sidenav_Settings_Interface = 'Frontend_Classic_Sidenav_Settings_Interface',
    Frontend_Classic_Sidenav_Settings_Trackers = 'Frontend_Classic_Sidenav_Settings_Trackers',
    Frontend_Classic_Sidenav_Settings_Network = 'Frontend_Classic_Sidenav_Settings_Network',
}

// [SECTION]: Frontend: FluentCore
export enum FrontendResourceKey {
    Frontend_FluentCore_Label = 'Frontend_FluentCore_Label',
    Frontend_FluentCore_Description = 'Frontend_FluentCore_Description',

    Frontend_FluentCore_Window_ButtonMinimize_Description = 'Frontend_FluentCore_Window_ButtonMinimize_Description',
    Frontend_FluentCore_Window_ButtonMaximize_Description = 'Frontend_FluentCore_Window_ButtonMaximize_Description',
    Frontend_FluentCore_Window_ButtonRestore_Description = 'Frontend_FluentCore_Window_ButtonRestore_Description',
    Frontend_FluentCore_Window_ButtonClose_Description = 'Frontend_FluentCore_Window_ButtonClose_Description',

    Frontend_FluentCore_Menu_Description = 'Frontend_FluentCore_Menu_Description',
    Frontend_FluentCore_Menu_OpenSettings_Label = 'Frontend_FluentCore_Menu_OpenSettings_Label',
    Frontend_FluentCore_Menu_OpenSettings_Description = 'Frontend_FluentCore_Menu_OpenSettings_Description',
    Frontend_FluentCore_Menu_ImportBookmarks_Label = 'Frontend_FluentCore_Menu_ImportBookmarks_Label',
    Frontend_FluentCore_Menu_ImportBookmarks_Description = 'Frontend_FluentCore_Menu_ImportBookmarks_Description',
    Frontend_FluentCore_Menu_ExportBookmarks_Label = 'Frontend_FluentCore_Menu_ExportBookmarks_Label',
    Frontend_FluentCore_Menu_ExportBookmarks_Description = 'Frontend_FluentCore_Menu_ExportBookmarks_Description',

    Frontend_FluentCore_Settings_ThemeLuminance_Label = 'Frontend_FluentCore_Settings_ThemeLuminance_Label',
    Frontend_FluentCore_Settings_ThemeLuminance_Description = 'Frontend_FluentCore_Settings_ThemeLuminance_Description',
    Frontend_FluentCore_Settings_ShowBookmarksPanel_Label = 'Frontend_FluentCore_Settings_ShowBookmarksPanel_Label',
    Frontend_FluentCore_Settings_ShowBookmarksPanel_Description = 'Frontend_FluentCore_Settings_ShowBookmarksPanel_Description',
    Frontend_FluentCore_Settings_ShowDownloadsPanel_Label = 'Frontend_FluentCore_Settings_ShowDownloadsPanel_Label',
    Frontend_FluentCore_Settings_ShowDownloadsPanel_Description = 'Frontend_FluentCore_Settings_ShowDownloadsPanel_Description',

    Frontend_FluentCore_SettingsDialog_Title = 'Frontend_FluentCore_SettingsDialog_Title',
    Frontend_FluentCore_SettingsDialog_CloseButton_Label = 'Frontend_FluentCore_SettingsDialog_CloseButton_Label',

    Frontend_FluentCore_BookmarkList_Heading = 'Frontend_FluentCore_BookmarkList_Heading',

    Frontend_FluentCore_DownloadManager_Heading = 'Frontend_FluentCore_DownloadManager_Heading',
    Frontend_FluentCore_DownloadManagerTask_StatusQueued_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusQueued_Description',
    Frontend_FluentCore_DownloadManagerTask_StatusPaused_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusPaused_Description',
    Frontend_FluentCore_DownloadManagerTask_StatusDownloading_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusDownloading_Description',
    Frontend_FluentCore_DownloadManagerTask_StatusProcessing_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusProcessing_Description',
    Frontend_FluentCore_DownloadManagerTask_StatusFailed_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusFailed_Description',
    Frontend_FluentCore_DownloadManagerTask_StatusCompleted_Description = 'Frontend_FluentCore_DownloadManagerTask_StatusCompleted_Description',
    Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description = 'Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description',

    Frontend_FluentCore_WebsiteSelect_Description = 'Frontend_FluentCore_WebsiteSelect_Description',
    Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description = 'Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description',
    Frontend_FluentCore_WebsiteSelect_BusyStatus_Description = 'Frontend_FluentCore_WebsiteSelect_BusyStatus_Description',
    Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description = 'Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description',
    Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description = 'Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description',
    Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description = 'Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description',
    Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder = 'Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder',

    Frontend_FluentCore_MediaTitleSelect_Description = 'Frontend_FluentCore_MediaTitleSelect_Description',
    Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description = 'Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description',
    Frontend_FluentCore_MediaTitleSelect_BusyStatus_Description = 'Frontend_FluentCore_MediaTitleSelect_BusyStatus_Description',
    Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description = 'Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description',
    Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description = 'Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description',
    Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description = 'Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description',
    Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder = 'Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder',

    Frontend_FluentCore_MediaItemList_Heading = 'Frontend_FluentCore_MediaItemList_Heading',
    Frontend_FluentCore_MediaItemList_PreviewButton_Description = 'Frontend_FluentCore_MediaItemList_PreviewButton_Description',
    Frontend_FluentCore_MediaItemList_DownloadButton_Description = 'Frontend_FluentCore_MediaItemList_DownloadButton_Description',

    Frontend_FluentCore_Preview_CloseButton_Description = 'Frontend_FluentCore_Preview_CloseButton_Description',

    Frontend_FluentCore_SearchBox_ClearButton_Description = 'Frontend_FluentCore_SearchBox_ClearButton_Description',
    Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description = 'Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description',
    Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description = 'Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description',
}

// [SECTION]: Engine
export enum EngineResourceKey {
    Settings_Global_Frontend = 'Settings_Global_Frontend',
    Settings_Global_FrontendInfo = 'Settings_Global_FrontendInfo',
    Settings_Global_Language = 'Settings_Global_Language',
    Settings_Global_LanguageInfo = 'Settings_Global_LanguageInfo',
    Settings_Global_MediaDirectory = 'Settings_Global_MediaDirectory',
    Settings_Global_MediaDirectoryInfo = 'Settings_Global_MediaDirectoryInfo',
    Settings_Global_MediaDirectory_UnsetError = 'Settings_Global_MediaDirectory_UnsetError',
    Settings_Global_MediaDirectory_PermissionError = 'Settings_Global_MediaDirectory_PermissionError',
    Settings_Global_WebsiteSubDirectory = 'Settings_Global_WebsiteSubDirectory',
    Settings_Global_WebsiteSubDirectoryInfo = 'Settings_Global_WebsiteSubDirectoryInfo',
    Settings_Global_MangaExportFormat = 'Settings_Global_MangaExportFormat',
    Settings_Global_MangaExportFormatInfo = 'Settings_Global_MangaExportFormatInfo',
    Settings_Global_MangaExportFormat_FolderWithImages = 'Settings_Global_MangaExportFormat_FolderWithImages',
    Settings_Global_MangaExportFormat_ComicBookArchive = 'Settings_Global_MangaExportFormat_ComicBookArchive',
    Settings_Global_MangaExportFormat_ElectronicPublication = 'Settings_Global_MangaExportFormat_ElectronicPublication',
    Settings_Global_MangaExportFormat_PortableDocumentFormat = 'Settings_Global_MangaExportFormat_PortableDocumentFormat',
    Settings_Global_DescramblingFormat = 'Settings_Global_DescramblingFormat',
    Settings_Global_DescramblingFormatInfo = 'Settings_Global_DescramblingFormatInfo',
    Settings_Global_DescramblingQuality = 'Settings_Global_DescramblingQuality',
    Settings_Global_DescramblingQualityInfo = 'Settings_Global_DescramblingQualityInfo',
    Settings_Global_Format_PNG = 'Settings_Global_Format_PNG',
    Settings_Global_Format_JPEG = 'Settings_Global_Format_JPEG',
    Settings_Global_Format_WEBP = 'Settings_Global_Format_WEBP',
    Settings_Global_UserAgent = 'Settings_Global_UserAgent',
    Settings_Global_UserAgentInfo = 'Settings_Global_UserAgentInfo',
    Settings_Global_HCaptchaToken = 'Settings_Global_HCaptchaToken',
    Settings_Global_HCaptchaTokenInfo = 'Settings_Global_HCaptchaTokenInfo',
    Settings_Global_PostCommand = 'Settings_Global_PostCommand',
    Settings_Global_PostCommandInfo = 'Settings_Global_PostCommandInfo',
    Settings_NewContent_Check = 'Settings_NewContent_Check',
    Settings_NewContent_CheckInfo = 'Settings_NewContent_CheckInfo',
    Settings_NewContent_CheckPeriod = 'Settings_NewContent_CheckPeriod',
    Settings_NewContent_CheckPeriodInfo = 'Settings_NewContent_CheckPeriodInfo',
    Settings_NewContent_Notify = 'Settings_NewContent_Notify',
    Settings_NewContent_NotifyInfo = 'Settings_NewContent_NotifyInfo',
    Settings_Global_RPCEnabled = 'Settings_Global_RPCEnabled',
    Settings_Global_RPCEnabledInfo = 'Settings_Global_RPCEnabledInfo',
    Settings_Global_RPCPort = 'Settings_Global_RPCPort',
    Settings_Global_RPCPortInfo = 'Settings_Global_RPCPortInfo',
    Settings_Global_RPCSecret = 'Settings_Global_RPCSecret',
    Settings_Global_RPCSecretInfo = 'Settings_Global_RPCSecretInfo',

    Settings_FeatureFlags_Label = 'Settings_FeatureFlags_Label',
    Settings_FeatureFlags_Description = 'Settings_FeatureFlags_Description',
    Settings_FeatureFlags_ShowSplashScreen_Label = 'Settings_FeatureFlags_ShowSplashScreen_Label',
    Settings_FeatureFlags_ShowSplashScreen_Description = 'Settings_FeatureFlags_ShowSplashScreen_Description',
    Settings_FeatureFlags_ShowFetchBrowserWindows_Label = 'Settings_FeatureFlags_ShowFetchBrowserWindows_Label',
    Settings_FeatureFlags_ShowFetchBrowserWindows_Description = 'Settings_FeatureFlags_ShowFetchBrowserWindows_Description',
    Settings_FeatureFlags_CrowdinTranslationMode_Label = 'Settings_FeatureFlags_CrowdinTranslationMode_Label',
    Settings_FeatureFlags_CrowdinTranslationMode_Description = 'Settings_FeatureFlags_CrowdinTranslationMode_Description',

    SettingsManager_Settings_AlreadyInitializedError = 'SettingsManager_Settings_AlreadyInitializedError',

    FetchProvider_FetchGraphQL_AggregateError = 'FetchProvider_FetchGraphQL_AggregateError',
    FetchProvider_FetchGraphQL_MissingDataError = 'FetchProvider_FetchGraphQL_MissingDataError',
    FetchProvider_FetchWindow_TimeoutError = 'FetchProvider_FetchWindow_TimeoutError',
    FetchProvider_FetchWindow_CloudFlareError = 'FetchProvider_FetchWindow_CloudFlareError',
    FetchProvider_FetchWindow_AlertCaptcha = 'FetchProvider_FetchWindow_AlertCaptcha',
    FetchProvider_Fetch_CloudFlareChallenge = 'FetchProvider_Fetch_CloudFlareChallenge',
    FetchProvider_Fetch_Forbidden = 'FetchProvider_Fetch_Forbidden',

    BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError = 'BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError',
}

// [SECTION]: Tracker Kitsu
export enum TrackerResourceKey {
    Tracker_Kitsu_Settings_Username = 'Tracker_Kitsu_Settings_Username',
    Tracker_Kitsu_Settings_UsernameInfo = 'Tracker_Kitsu_Settings_UsernameInfo',
    Tracker_Kitsu_Settings_Password = 'Tracker_Kitsu_Settings_Password',
    Tracker_Kitsu_Settings_PasswordInfo = 'Tracker_Kitsu_Settings_PasswordInfo',
}

// [SECTION]: Websites (Common)
export enum WebsiteResourceKey {
    Plugin_Settings_ThrottlingDownloads = 'Plugin_Settings_ThrottlingDownloads',
    Plugin_Settings_ThrottlingDownloadsInfo = 'Plugin_Settings_ThrottlingDownloadsInfo',
    Plugin_Settings_ThrottlingInteraction = 'Plugin_Settings_ThrottlingInteraction',
    Plugin_Settings_ThrottlingInteractionInfo = 'Plugin_Settings_ThrottlingInteractionInfo',
    Plugin_Settings_UrlOverride = 'Plugin_Settings_UrlOverride',
    Plugin_Settings_UrlOverrideInfo = 'Plugin_Settings_UrlOverrideInfo',
    Plugin_Settings_ImageFormat = 'Plugin_Settings_ImageFormat',
    Plugin_Settings_ImageFormatInfo = 'Plugin_Settings_ImageFormatInfo',
    Plugin_Common_MangaIndex_NotSupported = 'Plugin_Common_MangaIndex_NotSupported',
    Plugin_Common_Chapter_InvalidError = 'Plugin_Common_Chapter_InvalidError',
    Plugin_Common_Chapter_UnavailableError = 'Plugin_Common_Chapter_UnavailableError',
    Plugin_Common_Preferred_Language = 'Plugin_Common_Preferred_Language',
    Plugin_Common_Preferred_LanguageInfo = 'Plugin_Common_Preferred_LanguageInfo',
    Plugin_MissingWebsite_UpdateError = 'Plugin_MissingWebsite_UpdateError',
    Plugin_MissingWebsiteEntry_UpdateError = 'Plugin_MissingWebsiteEntry_UpdateError',
}

// [SECTION]: Website CopyManga
export enum WebsiteResourceKey {
    Plugin_CopyManga_Settings_GlobalCDN = 'Plugin_CopyManga_Settings_GlobalCDN',
    Plugin_CopyManga_Settings_GlobalCDNInfo = 'Plugin_CopyManga_Settings_GlobalCDNInfo',
}

// [SECTION]: Website PocketComics
export enum WebsiteResourceKey {
    Plugin_PocketComics_LanguageMismatchError = 'Plugin_PocketComics_LanguageMismatchError',
}

// [SECTION]: Website SheepScanlations
export enum WebsiteResourceKey {
    Plugin_SheepScanlations_Settings_Username = 'Plugin_SheepScanlations_Settings_Username',
    Plugin_SheepScanlations_Settings_UsernameInfo = 'Plugin_SheepScanlations_Settings_UsernameInfo',
    Plugin_SheepScanlations_Settings_Password = 'Plugin_SheepScanlations_Settings_Password',
    Plugin_SheepScanlations_Settings_PasswordInfo = 'Plugin_SheepScanlations_Settings_PasswordInfo',
}

export const VariantResourceKey = {
    ...TagCategoryResourceKey,
    ...TagResourceKey,
    ...AnnotationCategoryResourceKey,
    ...AnnotationResourceKey,
    ...FrontendResourceKey,
    ...EngineResourceKey,
    ...TrackerResourceKey,
    ...WebsiteResourceKey,
};