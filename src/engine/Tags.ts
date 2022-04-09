import { ResourceKey } from '../i18n/ILocale';

class Tag extends Object {

    public readonly categoryKey: ResourceKey;
    public readonly titleKey: ResourceKey;
    public readonly descriptionKey: ResourceKey;

    public constructor(categoryKey: ResourceKey, titleKey: ResourceKey, descriptionKey: ResourceKey = null) {
        super();
        this.categoryKey = categoryKey;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
    }

    public get Category(): ResourceKey {
        return this.categoryKey;
    }

    public get Title(): ResourceKey {
        return this.titleKey;
    }

    public get Description(): ResourceKey {
        return this.descriptionKey ? this.descriptionKey : this.Title;
    }
}

export type { Tag };

function GetCategoryTags(): Tag[] {
    return Object.values(this).filter((value): value is Tag => value instanceof Tag);
}

export const Tags = {
    Media: {
        toArray: GetCategoryTags,
        Title: ResourceKey.Tags_Media,
        /**
         * Keywords: Eastern, Japan, Black & White, Pagination
         */
        Manga: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Manga, ResourceKey.Tags_Media_MangaDescription),
        /**
         * Keywords: Eastern, China, Colored, Longstrip, Martial Art Fantasy
         */
        Manhua: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Manhua, ResourceKey.Tags_Media_ManhuaDescription),
        /**
         * Keywords: Eastern, South Korea, Colored, Longstrip, Pop Culture
         */
        Manhwa: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Manhwa, ResourceKey.Tags_Media_ManhwaDescription),
        /**
         * Keywords: Western, America/Europe, Colored, Pagination
         */
        Comic: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Comic, ResourceKey.Tags_Media_ComicDescription),
        Anime: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Anime, ResourceKey.Tags_Media_AnimeDescription),
        Cartoon: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Cartoon, ResourceKey.Tags_Media_CartoonDescription),
        Novel: new Tag(ResourceKey.Tags_Media, ResourceKey.Tags_Media_Novel, ResourceKey.Tags_Media_NovelDescription),
    },
    Source: {
        toArray: GetCategoryTags,
        Title: ResourceKey.Tags_Source,
        /**
         * Keywords: Licensed Publisher, Original Content
         */
        Official: new Tag(ResourceKey.Tags_Source, ResourceKey.Tags_Source_Official),
        /**
         * Keywords: Fan Translated, Manipulated Original Content
         */
        Scanlator: new Tag(ResourceKey.Tags_Source, ResourceKey.Tags_Source_Scanlator),
        /**
         * Keywords: Unlicensed Distribution, No Scanlator Attribution, Ripped/Watermarked Content, Huge Library
         */
        Aggregator: new Tag(ResourceKey.Tags_Source, ResourceKey.Tags_Source_Aggregator),
    },
    Accessibility: {
        toArray: GetCategoryTags,
        Title: ResourceKey.Tags_Accessibility,
        RegionLocked: new Tag(ResourceKey.Tags_Accessibility, ResourceKey.Tags_Accessibility_RegionLock, ResourceKey.Tags_Accessibility_RegionLockDescription),
        RateLimited: new Tag(ResourceKey.Tags_Accessibility, ResourceKey.Tags_Accessibility_RateLimit, ResourceKey.Tags_Accessibility_RateLimitDescription),
    },
    Rating: {
        toArray: GetCategoryTags,
        Title: ResourceKey.Tags_Rating,
        Safe: new Tag(ResourceKey.Tags_Rating, ResourceKey.Tags_Rating_Safe),
        Suggestive: new Tag(ResourceKey.Tags_Rating, ResourceKey.Tags_Rating_Suggestive),
        Erotica: new Tag(ResourceKey.Tags_Rating, ResourceKey.Tags_Rating_Erotica),
        Pornographic: new Tag(ResourceKey.Tags_Rating, ResourceKey.Tags_Rating_Pornographic),
    },
    Language: {
        toArray: GetCategoryTags,
        Title: ResourceKey.Tags_Language,
        Multilingual: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Multilingual),
        Arabic: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Arabic),
        Chinese: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Chinese),
        English: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_English),
        French: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_French),
        German: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_German),
        Indonesian: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Indonesian),
        Italian: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Italian),
        Japanese: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Japanese),
        Korean: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Korean),
        Polish: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Polish),
        Portuguese: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Portuguese),
        Russian: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Russian),
        Spanish: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Spanish),
        Thai: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Thai),
        Turkish: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Turkish),
        Vietnamese: new Tag(ResourceKey.Tags_Language, ResourceKey.Tags_Language_Vietnamese),
    },
};