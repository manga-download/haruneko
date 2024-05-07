import { TagCategoryResourceKey as TC, TagResourceKey as T } from '../i18n/ILocale';
import type { AnnotationCategoryResourceKey as AC, AnnotationResourceKey as A } from '../i18n/ILocale';

export class Tag extends Object {

    public readonly categoryKey: TC | AC;
    public readonly titleKey: T | A;
    public readonly descriptionKey: T | A;

    public constructor(categoryKey: TC | AC, titleKey: T | A, descriptionKey: T | A = null) {
        super();
        this.categoryKey = categoryKey;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
    }

    public get Category(): TC | AC {
        return this.categoryKey;
    }

    public get Title(): T | A {
        return this.titleKey;
    }

    public get Description(): T | A {
        return this.descriptionKey ? this.descriptionKey : this.Title;
    }
}

function GetCategoryTags(): Tag[] {
    return Object.values(this).filter((value): value is Tag => value instanceof Tag);
}

export const Tags = {
    Media: {
        toArray: GetCategoryTags,
        Title: TC.Tags_Media,
        /**
         * Keywords: Eastern, Japan, Black & White, Pagination
         */
        Manga: new Tag(TC.Tags_Media, T.Tags_Media_Manga, T.Tags_Media_MangaDescription),
        /**
         * Keywords: Eastern, China, Colored, Longstrip, Martial Art Fantasy
         */
        Manhua: new Tag(TC.Tags_Media, T.Tags_Media_Manhua, T.Tags_Media_ManhuaDescription),
        /**
         * Keywords: Eastern, South Korea, Colored, Longstrip, Pop Culture
         */
        Manhwa: new Tag(TC.Tags_Media, T.Tags_Media_Manhwa, T.Tags_Media_ManhwaDescription),
        /**
         * Keywords: Western, America/Europe, Colored, Pagination
         */
        Comic: new Tag(TC.Tags_Media, T.Tags_Media_Comic, T.Tags_Media_ComicDescription),
        Anime: new Tag(TC.Tags_Media, T.Tags_Media_Anime, T.Tags_Media_AnimeDescription),
        Cartoon: new Tag(TC.Tags_Media, T.Tags_Media_Cartoon, T.Tags_Media_CartoonDescription),
        Novel: new Tag(TC.Tags_Media, T.Tags_Media_Novel, T.Tags_Media_NovelDescription),
    },
    Source: {
        toArray: GetCategoryTags,
        Title: TC.Tags_Source,
        /**
         * Keywords: Licensed Publisher, Original Content
         */
        Official: new Tag(TC.Tags_Source, T.Tags_Source_Official),
        /**
         * Keywords: Fan Translated, Manipulated Original Content
         */
        Scanlator: new Tag(TC.Tags_Source, T.Tags_Source_Scanlator),
        /**
         * Keywords: Unlicensed Distribution, No Scanlator Attribution, Ripped/Watermarked Content, Huge Library
         */
        Aggregator: new Tag(TC.Tags_Source, T.Tags_Source_Aggregator),
    },
    Accessibility: {
        toArray: GetCategoryTags,
        Title: TC.Tags_Accessibility,
        RegionLocked: new Tag(TC.Tags_Accessibility, T.Tags_Accessibility_RegionLock, T.Tags_Accessibility_RegionLockDescription),
        RateLimited: new Tag(TC.Tags_Accessibility, T.Tags_Accessibility_RateLimit, T.Tags_Accessibility_RateLimitDescription),
    },
    Rating: {
        toArray: GetCategoryTags,
        Title: TC.Tags_Rating,
        Safe: new Tag(TC.Tags_Rating, T.Tags_Rating_Safe),
        Suggestive: new Tag(TC.Tags_Rating, T.Tags_Rating_Suggestive),
        Erotica: new Tag(TC.Tags_Rating, T.Tags_Rating_Erotica),
        Pornographic: new Tag(TC.Tags_Rating, T.Tags_Rating_Pornographic),
    },
    Language: {
        toArray: GetCategoryTags,
        Title: TC.Tags_Language,
        Multilingual: new Tag(TC.Tags_Language, T.Tags_Language_Multilingual),
        Arabic: new Tag(TC.Tags_Language, T.Tags_Language_Arabic),
        Chinese: new Tag(TC.Tags_Language, T.Tags_Language_Chinese),
        English: new Tag(TC.Tags_Language, T.Tags_Language_English),
        French: new Tag(TC.Tags_Language, T.Tags_Language_French),
        German: new Tag(TC.Tags_Language, T.Tags_Language_German),
        Indonesian: new Tag(TC.Tags_Language, T.Tags_Language_Indonesian),
        Italian: new Tag(TC.Tags_Language, T.Tags_Language_Italian),
        Japanese: new Tag(TC.Tags_Language, T.Tags_Language_Japanese),
        Korean: new Tag(TC.Tags_Language, T.Tags_Language_Korean),
        Polish: new Tag(TC.Tags_Language, T.Tags_Language_Polish),
        Portuguese: new Tag(TC.Tags_Language, T.Tags_Language_Portuguese),
        Russian: new Tag(TC.Tags_Language, T.Tags_Language_Russian),
        Spanish: new Tag(TC.Tags_Language, T.Tags_Language_Spanish),
        Thai: new Tag(TC.Tags_Language, T.Tags_Language_Thai),
        Turkish: new Tag(TC.Tags_Language, T.Tags_Language_Turkish),
        Vietnamese: new Tag(TC.Tags_Language, T.Tags_Language_Vietnamese),
    },
};