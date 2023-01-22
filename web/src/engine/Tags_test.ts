import { Tags } from './Tags';
import { VariantResourceKey } from '../i18n/ILocale';

describe('Tags.Media', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Media.Title).toBe(VariantResourceKey.Tags_Media);
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
            VariantResourceKey.Tags_Media_Manga,
            VariantResourceKey.Tags_Media_Manhua,
            VariantResourceKey.Tags_Media_Manhwa,
            VariantResourceKey.Tags_Media_Comic,
            VariantResourceKey.Tags_Media_Anime,
            VariantResourceKey.Tags_Media_Cartoon,
            VariantResourceKey.Tags_Media_Novel,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            VariantResourceKey.Tags_Media_MangaDescription,
            VariantResourceKey.Tags_Media_ManhuaDescription,
            VariantResourceKey.Tags_Media_ManhwaDescription,
            VariantResourceKey.Tags_Media_ComicDescription,
            VariantResourceKey.Tags_Media_AnimeDescription,
            VariantResourceKey.Tags_Media_CartoonDescription,
            VariantResourceKey.Tags_Media_NovelDescription,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Source', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Source.Title).toBe(VariantResourceKey.Tags_Source);
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
            VariantResourceKey.Tags_Source_Official,
            VariantResourceKey.Tags_Source_Scanlator,
            VariantResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            VariantResourceKey.Tags_Source_Official,
            VariantResourceKey.Tags_Source_Scanlator,
            VariantResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Rating', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Rating.Title).toBe(VariantResourceKey.Tags_Rating);
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
            VariantResourceKey.Tags_Rating_Safe,
            VariantResourceKey.Tags_Rating_Suggestive,
            VariantResourceKey.Tags_Rating_Erotica,
            VariantResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            VariantResourceKey.Tags_Rating_Safe,
            VariantResourceKey.Tags_Rating_Suggestive,
            VariantResourceKey.Tags_Rating_Erotica,
            VariantResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Language', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Language.Title).toBe(VariantResourceKey.Tags_Language);
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
            VariantResourceKey.Tags_Language_Multilingual,
            VariantResourceKey.Tags_Language_Arabic,
            VariantResourceKey.Tags_Language_Chinese,
            VariantResourceKey.Tags_Language_English,
            VariantResourceKey.Tags_Language_French,
            VariantResourceKey.Tags_Language_German,
            VariantResourceKey.Tags_Language_Indonesian,
            VariantResourceKey.Tags_Language_Italian,
            VariantResourceKey.Tags_Language_Japanese,
            VariantResourceKey.Tags_Language_Korean,
            VariantResourceKey.Tags_Language_Polish,
            VariantResourceKey.Tags_Language_Portuguese,
            VariantResourceKey.Tags_Language_Russian,
            VariantResourceKey.Tags_Language_Spanish,
            VariantResourceKey.Tags_Language_Thai,
            VariantResourceKey.Tags_Language_Turkish,
            VariantResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            VariantResourceKey.Tags_Language_Multilingual,
            VariantResourceKey.Tags_Language_Arabic,
            VariantResourceKey.Tags_Language_Chinese,
            VariantResourceKey.Tags_Language_English,
            VariantResourceKey.Tags_Language_French,
            VariantResourceKey.Tags_Language_German,
            VariantResourceKey.Tags_Language_Indonesian,
            VariantResourceKey.Tags_Language_Italian,
            VariantResourceKey.Tags_Language_Japanese,
            VariantResourceKey.Tags_Language_Korean,
            VariantResourceKey.Tags_Language_Polish,
            VariantResourceKey.Tags_Language_Portuguese,
            VariantResourceKey.Tags_Language_Russian,
            VariantResourceKey.Tags_Language_Spanish,
            VariantResourceKey.Tags_Language_Thai,
            VariantResourceKey.Tags_Language_Turkish,
            VariantResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});