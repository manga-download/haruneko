import { describe, it, expect } from 'vitest';
import { Tags } from './Tags';
import { TagCategoryResourceKey, TagResourceKey } from '../i18n/ILocale';

describe('Tags.Media', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Media.Title).toBe(TagCategoryResourceKey.Tags_Media);
        expect(Tags.Media.toArray().every(tag => tag.Category === Tags.Media.Title)).toBeTruthy();
    });

    it('Should list all tags in this category', async () => {
        const expected = [
            Tags.Media.Manga,
            Tags.Media.Manhua,
            Tags.Media.Manhwa,
            Tags.Media.Comic,
            Tags.Media.Anime,
            Tags.Media.Cartoon,
            Tags.Media.Novel,
        ];
        expect(Tags.Media.toArray()).toStrictEqual(expected);
    });

    it('Should default to english tag titles without formatting', async () => {
        const expected = [
            TagResourceKey.Tags_Media_Manga,
            TagResourceKey.Tags_Media_Manhua,
            TagResourceKey.Tags_Media_Manhwa,
            TagResourceKey.Tags_Media_Comic,
            TagResourceKey.Tags_Media_Anime,
            TagResourceKey.Tags_Media_Cartoon,
            TagResourceKey.Tags_Media_Novel,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            TagResourceKey.Tags_Media_MangaDescription,
            TagResourceKey.Tags_Media_ManhuaDescription,
            TagResourceKey.Tags_Media_ManhwaDescription,
            TagResourceKey.Tags_Media_ComicDescription,
            TagResourceKey.Tags_Media_AnimeDescription,
            TagResourceKey.Tags_Media_CartoonDescription,
            TagResourceKey.Tags_Media_NovelDescription,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Source', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Source.Title).toBe(TagCategoryResourceKey.Tags_Source);
        expect(Tags.Source.toArray().every(tag => tag.Category === Tags.Source.Title)).toBeTruthy();
    });

    it('Should list all tags in this category', async () => {
        const expected = [
            Tags.Source.Official,
            Tags.Source.Scanlator,
            Tags.Source.Aggregator,
        ];
        expect(Tags.Source.toArray()).toStrictEqual(expected);
    });

    it('Should default to english tag titles without formatting', async () => {
        const expected = [
            TagResourceKey.Tags_Source_Official,
            TagResourceKey.Tags_Source_Scanlator,
            TagResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            TagResourceKey.Tags_Source_Official,
            TagResourceKey.Tags_Source_Scanlator,
            TagResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Rating', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Rating.Title).toBe(TagCategoryResourceKey.Tags_Rating);
        expect(Tags.Rating.toArray().every(tag => tag.Category === Tags.Rating.Title)).toBeTruthy();
    });

    it('Should list all tags in this category', async () => {
        const expected = [
            Tags.Rating.Safe,
            Tags.Rating.Suggestive,
            Tags.Rating.Erotica,
            Tags.Rating.Pornographic,
        ];
        expect(Tags.Rating.toArray()).toStrictEqual(expected);
    });

    it('Should default to english tag titles without formatting', async () => {
        const expected = [
            TagResourceKey.Tags_Rating_Safe,
            TagResourceKey.Tags_Rating_Suggestive,
            TagResourceKey.Tags_Rating_Erotica,
            TagResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            TagResourceKey.Tags_Rating_Safe,
            TagResourceKey.Tags_Rating_Suggestive,
            TagResourceKey.Tags_Rating_Erotica,
            TagResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Language', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Language.Title).toBe(TagCategoryResourceKey.Tags_Language);
        expect(Tags.Language.toArray().every(tag => tag.Category === Tags.Language.Title)).toBeTruthy();
    });

    it('Should list all tags in this category', async () => {
        const expected = [
            Tags.Language.Multilingual,
            Tags.Language.Arabic,
            Tags.Language.Chinese,
            Tags.Language.English,
            Tags.Language.French,
            Tags.Language.German,
            Tags.Language.Indonesian,
            Tags.Language.Italian,
            Tags.Language.Japanese,
            Tags.Language.Korean,
            Tags.Language.Polish,
            Tags.Language.Portuguese,
            Tags.Language.Russian,
            Tags.Language.Spanish,
            Tags.Language.Thai,
            Tags.Language.Turkish,
            Tags.Language.Vietnamese,
        ];
        expect(Tags.Language.toArray()).toStrictEqual(expected);
    });

    it('Should default to english tag titles without formatting', async () => {
        const expected = [
            TagResourceKey.Tags_Language_Multilingual,
            TagResourceKey.Tags_Language_Arabic,
            TagResourceKey.Tags_Language_Chinese,
            TagResourceKey.Tags_Language_English,
            TagResourceKey.Tags_Language_French,
            TagResourceKey.Tags_Language_German,
            TagResourceKey.Tags_Language_Indonesian,
            TagResourceKey.Tags_Language_Italian,
            TagResourceKey.Tags_Language_Japanese,
            TagResourceKey.Tags_Language_Korean,
            TagResourceKey.Tags_Language_Polish,
            TagResourceKey.Tags_Language_Portuguese,
            TagResourceKey.Tags_Language_Russian,
            TagResourceKey.Tags_Language_Spanish,
            TagResourceKey.Tags_Language_Thai,
            TagResourceKey.Tags_Language_Turkish,
            TagResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            TagResourceKey.Tags_Language_Multilingual,
            TagResourceKey.Tags_Language_Arabic,
            TagResourceKey.Tags_Language_Chinese,
            TagResourceKey.Tags_Language_English,
            TagResourceKey.Tags_Language_French,
            TagResourceKey.Tags_Language_German,
            TagResourceKey.Tags_Language_Indonesian,
            TagResourceKey.Tags_Language_Italian,
            TagResourceKey.Tags_Language_Japanese,
            TagResourceKey.Tags_Language_Korean,
            TagResourceKey.Tags_Language_Polish,
            TagResourceKey.Tags_Language_Portuguese,
            TagResourceKey.Tags_Language_Russian,
            TagResourceKey.Tags_Language_Spanish,
            TagResourceKey.Tags_Language_Thai,
            TagResourceKey.Tags_Language_Turkish,
            TagResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});