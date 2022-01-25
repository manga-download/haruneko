import { i18n } from './i18n/Localization';

const i18nCategoryMedia = 'Tags.Media';
const i18nCategorySource = 'Tags.Source';
const i18nCategoryRating = 'Tags.Rating';
const i18nCategoryLanguage = 'Tags.Language';

/*
export interface ITag {
    toString(format?: string): string;
    readonly Category: string;
    readonly Title: string;
    readonly Description: string;
}
*/

class Tag extends Object {

    public readonly categoryKey: string;
    public readonly titleKey: string;
    public readonly descriptionKey: string;

    public constructor(categoryKey: string, titleKey: string, descriptionKey: string = null) {
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
        toString: () => i18n(i18nCategoryMedia),
        toArray: GetCategoryTags,
        Manga: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Manga`, `${i18nCategoryMedia}.MangaDescription`),
        Manhua: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Manhua`, `${i18nCategoryMedia}.ManhuaDescription`),
        Manhwa: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Manhwa`, `${i18nCategoryMedia}.ManhwaDescription`),
        Comic: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Comic`, `${i18nCategoryMedia}.ComicDescription`),
        Anime: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Anime`, `${i18nCategoryMedia}.AnimeDescription`),
        Cartoon: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Cartoon`, `${i18nCategoryMedia}.CartoonDescription`),
        Novel: new Tag(i18nCategoryMedia, `${i18nCategoryMedia}.Novel`, `${i18nCategoryMedia}.NovelDescription`),
    },
    Source: {
        toString: () => i18n(i18nCategorySource),
        toArray: GetCategoryTags,
        Official: new Tag(i18nCategorySource, `${i18nCategorySource}.Official`),
        Scanlator: new Tag(i18nCategorySource, `${i18nCategorySource}.Scanlator`),
        Aggregator: new Tag(i18nCategorySource, `${i18nCategorySource}.Aggregator`),
    },
    Rating: {
        toString: () => i18n(i18nCategoryRating),
        toArray: GetCategoryTags,
        Safe: new Tag(i18nCategoryRating, `${i18nCategoryRating}.Safe`),
        Suggestive: new Tag(i18nCategoryRating, `${i18nCategoryRating}.Suggestive`),
        Erotica: new Tag(i18nCategoryRating, `${i18nCategoryRating}.Erotica`),
        Pornographic: new Tag(i18nCategoryRating, `${i18nCategoryRating}.Pornographic`),
    },
    Language: {
        toString: () => i18n(i18nCategoryLanguage),
        toArray: GetCategoryTags,
        Multilingual: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Multilingual`),
        Arabic: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Arabic`),
        Chinese: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Chinese`),
        English: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.English`),
        French: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.French`),
        German: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.German`),
        Indonesian: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Indonesian`),
        Italian: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Italian`),
        Japanese: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Japanese`),
        Korean: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Korean`),
        Polish: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Polish`),
        Portuguese: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Portuguese`),
        Russian: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Russian`),
        Spanish: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Spanish`),
        Thai: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Thai`),
        Turkish: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Turkish`),
        Vietnamese: new Tag(i18nCategoryLanguage, `${i18nCategoryLanguage}.Vietnamese`),
    },
};