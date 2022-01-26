export type IResources = Record<ResourceKeys, string>;

export type ILocale = {
    readonly Code: string;
    readonly Title: string;
    readonly Resources: IResources;
}

/**
 * Pre-defined identifiers for localization resource strings.
 */
export enum ResourceKeys {
    FetchProvider_FetchWindow_TimeoutError = 'FetchProvider.FetchWindow.TimeoutError',
    FetchProvider_FetchWindow_CloudFlareError = 'FetchProvider.FetchWindow.CloudFlareError',
    FetchProvider_FetchWindow_AlertCaptcha = 'FetchProvider.FetchWindow.AlertCaptcha',
    FrontendController_Reload_ConfirmNotice = 'FrontendController.Reload.ConfirmNotice',
    Tags_Media = 'Tags.Media',
    Tags_Media_Manga = 'Tags.Media.Manga',
    Tags_Media_MangaDescription = 'Tags.Media.MangaDescription',
    Tags_Media_Manhua = 'Tags.Media.Manhua',
    Tags_Media_ManhuaDescription = 'Tags.Media.ManhuaDescription',
    Tags_Media_Manhwa = 'Tags.Media.Manhwa',
    Tags_Media_ManhwaDescription = 'Tags.Media.ManhwaDescription',
    Tags_Media_Comic = 'Tags.Media.Comic',
    Tags_Media_ComicDescription = 'Tags.Media.ComicDescription',
    Tags_Media_Anime = 'Tags.Media.Anime',
    Tags_Media_AnimeDescription = 'Tags.Media.AnimeDescription',
    Tags_Media_Cartoon = 'Tags.Media.Cartoon',
    Tags_Media_CartoonDescription = 'Tags.Media.CartoonDescription',
    Tags_Media_Novel = 'Tags.Media.Novel',
    Tags_Media_NovelDescription = 'Tags.Media.NovelDescription',
    Tags_Source = 'Tags.Source',
    Tags_Source_Official = 'Tags.Source.Official',
    Tags_Source_Scanlator = 'Tags.Source.Scanlator',
    Tags_Source_Aggregator = 'Tags.Source.Aggregator',
    Tags_Rating = 'Tags.Rating',
    Tags_Rating_Safe = 'Tags.Rating.Safe',
    Tags_Rating_Suggestive = 'Tags.Rating.Suggestive',
    Tags_Rating_Erotica = 'Tags.Rating.Erotica',
    Tags_Rating_Pornographic = 'Tags.Rating.Pornographic',
    // See: https://emojipedia.org/flags/
    Tags_Language = 'Tags.Language',
    Tags_Language_Multilingual = 'Tags.Language.Multilingual',
    Tags_Language_Arabic = 'Tags.Language.Arabic',
    Tags_Language_Chinese = 'Tags.Language.Chinese',
    Tags_Language_English = 'Tags.Language.English',
    Tags_Language_French = 'Tags.Language.French',
    Tags_Language_German = 'Tags.Language.German',
    Tags_Language_Indonesian = 'Tags.Language.Indonesian',
    Tags_Language_Italian = 'Tags.Language.Italian',
    Tags_Language_Japanese = 'Tags.Language.Japanese',
    Tags_Language_Korean = 'Tags.Language.Korean',
    Tags_Language_Polish = 'Tags.Language.Polish',
    Tags_Language_Portuguese = 'Tags.Language.Portuguese',
    Tags_Language_Russian = 'Tags.Language.Russian',
    Tags_Language_Spanish = 'Tags.Language.Spanish',
    Tags_Language_Thai = 'Tags.Language.Thai',
    Tags_Language_Turkish = 'Tags.Language.Turkish',
    Tags_Language_Vietnamese = 'Tags.Language.Vietnamese'
}