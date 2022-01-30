export type IResource = Record<ResourceKey, string>;
export type ILocale = Record<ResourceKey, (...params: string[]) => string>;

/**
 * All supported langauage codes (must be unique).
 */
export enum Code {
    en_US = 'en_US',
    fr_FR = 'fr_FR',
    de_DE = 'de_DE',
}

/**
 * All pre-defined identifiers that must be provided by any localization {@link IResource} implementation.
 */
export enum ResourceKey {

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice = 'FrontendController_Reload_ConfirmNotice',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title = 'Frontend_Product_Title',
    Frontend_Product_Description = 'Frontend_Product_Description',

    // [SECTION]: Frontend Classic

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

    // [SECTION]: Engine

    FetchProvider_FetchWindow_TimeoutError = 'FetchProvider_FetchWindow_TimeoutError',
    FetchProvider_FetchWindow_CloudFlareError = 'FetchProvider_FetchWindow_CloudFlareError',
    FetchProvider_FetchWindow_AlertCaptcha = 'FetchProvider_FetchWindow_AlertCaptcha',

    // [SECTION]: Tags

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