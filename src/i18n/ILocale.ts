export type IResource = Record<LocaleID | InvariantResourceKey | VariantResourceKey, string>;
export type ILocale = Record<keyof IResource, (...params: string[]) => string>;
export type IVariantResource = Record<VariantResourceKey, string>;

export enum LocaleID {
    Locale_arAE = 'Locale_arAE',
    Locale_deDE = 'Locale_deDE',
    Locale_enUS = 'Locale_enUS',
    Locale_esES = 'Locale_esES',
    Locale_filPH = 'Locale_filPH',
    Locale_frFR = 'Locale_frFR',
    Locale_inID = 'Locale_inID',
    Locale_ptBR = 'Locale_ptBR',
    Locale_ruRU = 'Locale_ruRU',
    Locale_thTH = 'Locale_thTH',
    Locale_trTR = 'Locale_trTR',
    Locale_zhCN = 'Locale_zhCN',
}

export enum InvariantResourceKey {
    //
}

/**
 * All pre-defined identifiers that must be provided by any localization {@link IResource} implementation.
 * Using merged enum for structuring ...
 */

// [SECTION]: Frontends (Common)
export enum VariantResourceKey {
    FrontendController_Reload_ConfirmNotice = 'FrontendController_Reload_ConfirmNotice',
    Frontend_Product_Title = 'Frontend_Product_Title',
    Frontend_Product_Description = 'Frontend_Product_Description',
}

// [SECTION]: Frontend Classic
export enum VariantResourceKey {
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
    Frontend_Classic_Settings_ViewerMode = 'Frontend_Classic_Settings_ViewerMode',
    Frontend_Classic_Settings_ViewerModeInfo = 'Frontend_Classic_Settings_ViewerModeInfo',
    Frontend_Classic_Settings_ViewerMode_Paginated = 'Frontend_Classic_Settings_ViewerMode_Paginated',
    Frontend_Classic_Settings_ViewerMode_Longstrip = 'Frontend_Classic_Settings_ViewerMode_Longstrip',
    Frontend_Classic_Settings_ViewerReverseDirection = 'Frontend_Classic_Settings_ViewerReverseDirection',
    Frontend_Classic_Settings_ViewerReverseDirectionInfo = 'Frontend_Classic_Settings_ViewerReverseDirectionInfo',
    Frontend_Classic_Settings_ViewerDoublePage = 'Frontend_Classic_Settings_ViewerDoublePage',
    Frontend_Classic_Settings_ViewerDoublePageInfo = 'Frontend_Classic_Settings_ViewerDoublePageInfo',
}
// [SECTION]: Frontend BarelyFluid
export enum VariantResourceKey {
    Frontend_BarelyFluid_TitleBar_CloseSettingsButton_Label = 'Frontend_BarelyFluid_TitleBar_CloseSettingsButton_Label',

    Frontend_BarelyFluid_WebsitePlugin_UpdateEntriesButton_Description = 'Frontend_BarelyFluid_WebsitePlugin_UpdateEntriesButton_Description',
    Frontend_BarelyFluid_WebsitePlugin_BusyStatus_Description = 'Frontend_BarelyFluid_WebsitePlugin_BusyStatus_Description',
    Frontend_BarelyFluid_WebsitePlugin_AddFavoriteButton_Description = 'Frontend_BarelyFluid_WebsitePlugin_AddFavoriteButton_Description',
    Frontend_BarelyFluid_WebsitePlugin_RemoveFavoriteButton_Description = 'Frontend_BarelyFluid_WebsitePlugin_RemoveFavoriteButton_Description',
    Frontend_BarelyFluid_WebsitePlugin_OpenSettingsButton_Description = 'Frontend_BarelyFluid_WebsitePlugin_OpenSettingsButton_Description',
    Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Placeholder = 'Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Placeholder',
    Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Label = 'Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Label',

    Frontend_BarelyFluid_MediaContainer_UpdateEntriesButton_Description = 'Frontend_BarelyFluid_MediaContainer_UpdateEntriesButton_Description',
    Frontend_BarelyFluid_MediaContainer_BusyStatus_Description = 'Frontend_BarelyFluid_MediaContainer_BusyStatus_Description',
    Frontend_BarelyFluid_MediaContainer_AddBookmarkButton_Description = 'Frontend_BarelyFluid_MediaContainer_AddBookmarkButton_Description',
    Frontend_BarelyFluid_MediaContainer_RemoveBookmarkButton_Description = 'Frontend_BarelyFluid_MediaContainer_RemoveBookmarkButton_Description',
    Frontend_BarelyFluid_MediaContainer_PasteClipboardButton_Description = 'Frontend_BarelyFluid_MediaContainer_PasteClipboardButton_Description',
    Frontend_BarelyFluid_MediaContainer_SearchTextbox_Placeholder = 'Frontend_BarelyFluid_MediaContainer_SearchTextbox_Placeholder',
    Frontend_BarelyFluid_MediaContainer_SearchTextbox_Label = 'Frontend_BarelyFluid_MediaContainer_SearchTextbox_Label',

    //Frontend_BarelyFluid_ = '',
}

// [SECTION]: Engine
export enum VariantResourceKey {
    Settings_Global_Language = 'Settings_Global_Language',
    Settings_Global_LanguageInfo = 'Settings_Global_LanguageInfo',
    Settings_Global_MediaDirectory = 'Settings_Global_MediaDirectory',
    Settings_Global_MediaDirectoryInfo = 'Settings_Global_MediaDirectoryInfo',
    Settings_Global_WebsiteSubDirectory = 'Settings_Global_WebsiteSubDirectory',
    Settings_Global_WebsiteSubDirectoryInfo = 'Settings_Global_WebsiteSubDirectoryInfo',
    Settings_Global_DescramblingFormat = 'Settings_Global_DescramblingFormat',
    Settings_Global_DescramblingFormatInfo = 'Settings_Global_DescramblingFormatInfo',
    Settings_Global_DescramblingFormat_PNG = 'Settings_Global_DescramblingFormat_PNG',
    Settings_Global_DescramblingFormat_JPEG = 'Settings_Global_DescramblingFormat_JPEG',
    Settings_Global_DescramblingFormat_WEBP = 'Settings_Global_DescramblingFormat_WEBP',
    Settings_Global_DescramblingQuality = 'Settings_Global_DescramblingQuality',
    Settings_Global_DescramblingQualityInfo = 'Settings_Global_DescramblingQualityInfo',
    Settings_Global_HCaptchaToken = 'Settings_Global_HCaptchaToken',
    Settings_Global_HCaptchaTokenInfo = 'Settings_Global_HCaptchaTokenInfo',
    Settings_Global_PostCommand = 'Settings_Global_PostCommand',
    Settings_Global_PostCommandInfo = 'Settings_Global_PostCommandInfo',

    SettingsManager_Settings_AlreadyInitializedError = 'SettingsManager_Settings_AlreadyInitializedError',

    FetchProvider_FetchWindow_TimeoutError = 'FetchProvider_FetchWindow_TimeoutError',
    FetchProvider_FetchWindow_CloudFlareError = 'FetchProvider_FetchWindow_CloudFlareError',
    FetchProvider_FetchWindow_AlertCaptcha = 'FetchProvider_FetchWindow_AlertCaptcha',
}

// [SECTION]: Tags
export enum VariantResourceKey {
    Tags_Media = 'Tags_Media',
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
    Tags_Source = 'Tags_Source',
    Tags_Source_Official = 'Tags_Source_Official',
    Tags_Source_Scanlator = 'Tags_Source_Scanlator',
    Tags_Source_Aggregator = 'Tags_Source_Aggregator',
    Tags_Accessibility = 'Tags_Accessibility',
    Tags_Accessibility_RegionLock = 'Tags_Accessibility_RegionLock',
    Tags_Accessibility_RegionLockDescription = 'Tags_Accessibility_RegionLockDescription',
    Tags_Accessibility_RateLimit = 'Tags_Accessibility_RateLimit',
    Tags_Accessibility_RateLimitDescription = 'Tags_Accessibility_RateLimitDescription',
    Tags_Rating = 'Tags_Rating',
    Tags_Rating_Safe = 'Tags_Rating_Safe',
    Tags_Rating_Suggestive = 'Tags_Rating_Suggestive',
    Tags_Rating_Erotica = 'Tags_Rating_Erotica',
    Tags_Rating_Pornographic = 'Tags_Rating_Pornographic',
    Tags_Language = 'Tags_Language',
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
    Tags_Others = 'Tags_Others',
}

// [SECTION]: Tracker Kitsu
export enum VariantResourceKey {
    Tracker_Kitsu_Settings_Username = 'Tracker_Kitsu_Settings_Username',
    Tracker_Kitsu_Settings_UsernameInfo = 'Tracker_Kitsu_Settings_UsernameInfo',
    Tracker_Kitsu_Settings_Password = 'Tracker_Kitsu_Settings_Password',
    Tracker_Kitsu_Settings_PasswordInfo = 'Tracker_Kitsu_Settings_PasswordInfo',
}

// [SECTION]: Websites (Common)
export enum VariantResourceKey {
    Plugin_Settings_Throttling = 'Plugin_Settings_Throttling',
    Plugin_Settings_ThrottlingInfo = 'Plugin_Settings_ThrottlingInfo',
    Plugin_Common_MangasNotSupported = 'Plugin_Common_MangasNotSupported',
}

// [SECTION]: Website SheepScanlations
export enum VariantResourceKey {
    Plugin_SheepScanlations_Settings_Username = 'Plugin_SheepScanlations_Settings_Username',
    Plugin_SheepScanlations_Settings_UsernameInfo = 'Plugin_SheepScanlations_Settings_UsernameInfo',
    Plugin_SheepScanlations_Settings_Password = 'Plugin_SheepScanlations_Settings_Password',
    Plugin_SheepScanlations_Settings_PasswordInfo = 'Plugin_SheepScanlations_Settings_PasswordInfo',
}