import { type IResource, VariantResourceKey as R } from '../i18n/ILocale';

class Tag extends Object {

    public readonly categoryKey: keyof IResource;
    public readonly titleKey: keyof IResource;
    public readonly descriptionKey: keyof IResource;

    public constructor(categoryKey: keyof IResource, titleKey: keyof IResource, descriptionKey: keyof IResource = null) {
        super();
        this.categoryKey = categoryKey;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
    }

    public get Category(): keyof IResource {
        return this.categoryKey;
    }

    public get Title(): keyof IResource {
        return this.titleKey;
    }

    public get Description(): keyof IResource {
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
        Title: R.Tags_Media,
        /**
         * Keywords: Eastern, Japan, Black & White, Pagination
         */
        Manga: new Tag(R.Tags_Media, R.Tags_Media_Manga, R.Tags_Media_MangaDescription),
        /**
         * Keywords: Eastern, China, Colored, Longstrip, Martial Art Fantasy
         */
        Manhua: new Tag(R.Tags_Media, R.Tags_Media_Manhua, R.Tags_Media_ManhuaDescription),
        /**
         * Keywords: Eastern, South Korea, Colored, Longstrip, Pop Culture
         */
        Manhwa: new Tag(R.Tags_Media, R.Tags_Media_Manhwa, R.Tags_Media_ManhwaDescription),
        /**
         * Keywords: Western, America/Europe, Colored, Pagination
         */
        Comic: new Tag(R.Tags_Media, R.Tags_Media_Comic, R.Tags_Media_ComicDescription),
        Anime: new Tag(R.Tags_Media, R.Tags_Media_Anime, R.Tags_Media_AnimeDescription),
        Cartoon: new Tag(R.Tags_Media, R.Tags_Media_Cartoon, R.Tags_Media_CartoonDescription),
        Novel: new Tag(R.Tags_Media, R.Tags_Media_Novel, R.Tags_Media_NovelDescription),
    },
    Source: {
        toArray: GetCategoryTags,
        Title: R.Tags_Source,
        /**
         * Keywords: Licensed Publisher, Original Content
         */
        Official: new Tag(R.Tags_Source, R.Tags_Source_Official),
        /**
         * Keywords: Fan Translated, Manipulated Original Content
         */
        Scanlator: new Tag(R.Tags_Source, R.Tags_Source_Scanlator),
        /**
         * Keywords: Unlicensed Distribution, No Scanlator Attribution, Ripped/Watermarked Content, Huge Library
         */
        Aggregator: new Tag(R.Tags_Source, R.Tags_Source_Aggregator),
    },
    Accessibility: {
        toArray: GetCategoryTags,
        Title: R.Tags_Accessibility,
        RegionLocked: new Tag(R.Tags_Accessibility, R.Tags_Accessibility_RegionLock, R.Tags_Accessibility_RegionLockDescription),
        RateLimited: new Tag(R.Tags_Accessibility, R.Tags_Accessibility_RateLimit, R.Tags_Accessibility_RateLimitDescription),
    },
    Rating: {
        toArray: GetCategoryTags,
        Title: R.Tags_Rating,
        Safe: new Tag(R.Tags_Rating, R.Tags_Rating_Safe),
        Suggestive: new Tag(R.Tags_Rating, R.Tags_Rating_Suggestive),
        Erotica: new Tag(R.Tags_Rating, R.Tags_Rating_Erotica),
        Pornographic: new Tag(R.Tags_Rating, R.Tags_Rating_Pornographic),
    },
    Language: {
        toArray: GetCategoryTags,
        Title: R.Tags_Language,
        Multilingual: new Tag(R.Tags_Language, R.Tags_Language_Multilingual),
        Arabic: new Tag(R.Tags_Language, R.Tags_Language_Arabic),
        Chinese: new Tag(R.Tags_Language, R.Tags_Language_Chinese),
        English: new Tag(R.Tags_Language, R.Tags_Language_English),
        French: new Tag(R.Tags_Language, R.Tags_Language_French),
        German: new Tag(R.Tags_Language, R.Tags_Language_German),
        Indonesian: new Tag(R.Tags_Language, R.Tags_Language_Indonesian),
        Italian: new Tag(R.Tags_Language, R.Tags_Language_Italian),
        Japanese: new Tag(R.Tags_Language, R.Tags_Language_Japanese),
        Korean: new Tag(R.Tags_Language, R.Tags_Language_Korean),
        Polish: new Tag(R.Tags_Language, R.Tags_Language_Polish),
        Portuguese: new Tag(R.Tags_Language, R.Tags_Language_Portuguese),
        Russian: new Tag(R.Tags_Language, R.Tags_Language_Russian),
        Spanish: new Tag(R.Tags_Language, R.Tags_Language_Spanish),
        Thai: new Tag(R.Tags_Language, R.Tags_Language_Thai),
        Turkish: new Tag(R.Tags_Language, R.Tags_Language_Turkish),
        Vietnamese: new Tag(R.Tags_Language, R.Tags_Language_Vietnamese),
    },
};

export function filterByCategory(tags : Tag[], category) : Tag[] {
    return tags.filter(tag => category.toArray().includes(tag));
}