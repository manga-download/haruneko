import { i18n, Keys } from './i18n/Localization';

class Tag extends Object {

    public readonly categoryKey: Keys;
    public readonly titleKey: Keys;
    public readonly descriptionKey: Keys;

    public constructor(categoryKey: Keys, titleKey: Keys, descriptionKey: Keys = null) {
        super();
        this.categoryKey = categoryKey;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
    }

    public get Category(): string {
        return i18n(this.categoryKey);
    }

    public get Title(): string {
        return i18n(this.titleKey);
    }

    public get Description(): string {
        return this.descriptionKey ? i18n(this.descriptionKey) : this.Title;
    }

    /**
     * Text representation of the tag
     * @param format A template where `%C` is replaced by the category and `%T` by the title of the tag
     */
    public toString(format?: string): string {
        return format ? format.replace(/%C/g, this.Category).replace(/%T/g, this.Title) : this.Title;
    }
}

export type { Tag };

function GetCategoryTags(): Tag[] {
    return Object.values(this).filter((value): value is Tag => value instanceof Tag);
}

export const Tags = {
    Media: {
        toString: () => i18n(Keys.Tags_Media),
        toArray: GetCategoryTags,
        /**
         * Keywords: Eastern, Japan, Black & White, Pagination
         */
        Manga: new Tag(Keys.Tags_Media, Keys.Tags_Media_Manga, Keys.Tags_Media_MangaDescription),
        /**
         * Keywords: Eastern, China, Colored, Longstrip, Martial Art Fantasy
         */
        Manhua: new Tag(Keys.Tags_Media, Keys.Tags_Media_Manhua, Keys.Tags_Media_ManhuaDescription),
        /**
         * Keywords: Eastern, South Korea, Colored, Longstrip, Pop Culture
         */
        Manhwa: new Tag(Keys.Tags_Media, Keys.Tags_Media_Manhwa, Keys.Tags_Media_ManhwaDescription),
        /**
         * Keywords: Western, America/Europe, Colored, Pagination
         */
        Comic: new Tag(Keys.Tags_Media, Keys.Tags_Media_Comic, Keys.Tags_Media_ComicDescription),
        Anime: new Tag(Keys.Tags_Media, Keys.Tags_Media_Anime, Keys.Tags_Media_AnimeDescription),
        Cartoon: new Tag(Keys.Tags_Media, Keys.Tags_Media_Cartoon, Keys.Tags_Media_CartoonDescription),
        Novel: new Tag(Keys.Tags_Media, Keys.Tags_Media_Novel, Keys.Tags_Media_NovelDescription),
    },
    Source: {
        toString: () => i18n(Keys.Tags_Source),
        toArray: GetCategoryTags,
        /**
         * Keywords: Licensed Publisher, Original Content
         */
        Official: new Tag(Keys.Tags_Source, Keys.Tags_Source_Official),
        /**
         * Keywords: Fan Translated, Manipulated Original Content
         */
        Scanlator: new Tag(Keys.Tags_Source, Keys.Tags_Source_Scanlator),
        /**
         * Keywords: Unlicensed Distribution, No Scanlator Attribution, Ripped/Watermarked Content, Huge Library
         */
        Aggregator: new Tag(Keys.Tags_Source, Keys.Tags_Source_Aggregator),
    },
    Rating: {
        toString: () => i18n(Keys.Tags_Rating),
        toArray: GetCategoryTags,
        Safe: new Tag(Keys.Tags_Rating, Keys.Tags_Rating_Safe),
        Suggestive: new Tag(Keys.Tags_Rating, Keys.Tags_Rating_Suggestive),
        Erotica: new Tag(Keys.Tags_Rating, Keys.Tags_Rating_Erotica),
        Pornographic: new Tag(Keys.Tags_Rating, Keys.Tags_Rating_Pornographic),
    },
    Language: {
        toString: () => i18n(Keys.Tags_Language),
        toArray: GetCategoryTags,
        Multilingual: new Tag(Keys.Tags_Language, Keys.Tags_Language_Multilingual),
        Arabic: new Tag(Keys.Tags_Language, Keys.Tags_Language_Arabic),
        Chinese: new Tag(Keys.Tags_Language, Keys.Tags_Language_Chinese),
        English: new Tag(Keys.Tags_Language, Keys.Tags_Language_English),
        French: new Tag(Keys.Tags_Language, Keys.Tags_Language_French),
        German: new Tag(Keys.Tags_Language, Keys.Tags_Language_German),
        Indonesian: new Tag(Keys.Tags_Language, Keys.Tags_Language_Indonesian),
        Italian: new Tag(Keys.Tags_Language, Keys.Tags_Language_Italian),
        Japanese: new Tag(Keys.Tags_Language, Keys.Tags_Language_Japanese),
        Korean: new Tag(Keys.Tags_Language, Keys.Tags_Language_Korean),
        Polish: new Tag(Keys.Tags_Language, Keys.Tags_Language_Polish),
        Portuguese: new Tag(Keys.Tags_Language, Keys.Tags_Language_Portuguese),
        Russian: new Tag(Keys.Tags_Language, Keys.Tags_Language_Russian),
        Spanish: new Tag(Keys.Tags_Language, Keys.Tags_Language_Spanish),
        Thai: new Tag(Keys.Tags_Language, Keys.Tags_Language_Thai),
        Turkish: new Tag(Keys.Tags_Language, Keys.Tags_Language_Turkish),
        Vietnamese: new Tag(Keys.Tags_Language, Keys.Tags_Language_Vietnamese),
    },
};