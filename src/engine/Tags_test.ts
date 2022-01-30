import { Tags } from './Tags';
import { ResourceKey } from '../i18n/ILocale';

describe('Tags.Media', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Media.Title).toBe(ResourceKey.Tags_Media);
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
            ResourceKey.Tags_Media_Manga,
            ResourceKey.Tags_Media_Manhua,
            ResourceKey.Tags_Media_Manhwa,
            ResourceKey.Tags_Media_Comic,
            ResourceKey.Tags_Media_Anime,
            ResourceKey.Tags_Media_Cartoon,
            ResourceKey.Tags_Media_Novel,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            ResourceKey.Tags_Media_MangaDescription,
            ResourceKey.Tags_Media_ManhuaDescription,
            ResourceKey.Tags_Media_ManhwaDescription,
            ResourceKey.Tags_Media_ComicDescription,
            ResourceKey.Tags_Media_AnimeDescription,
            ResourceKey.Tags_Media_CartoonDescription,
            ResourceKey.Tags_Media_NovelDescription,
        ];
        expect(Tags.Media.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Source', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Source.Title).toBe(ResourceKey.Tags_Source);
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
            ResourceKey.Tags_Source_Official,
            ResourceKey.Tags_Source_Scanlator,
            ResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            ResourceKey.Tags_Source_Official,
            ResourceKey.Tags_Source_Scanlator,
            ResourceKey.Tags_Source_Aggregator,
        ];
        expect(Tags.Source.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Rating', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Rating.Title).toBe(ResourceKey.Tags_Rating);
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
            ResourceKey.Tags_Rating_Safe,
            ResourceKey.Tags_Rating_Suggestive,
            ResourceKey.Tags_Rating_Erotica,
            ResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            ResourceKey.Tags_Rating_Safe,
            ResourceKey.Tags_Rating_Suggestive,
            ResourceKey.Tags_Rating_Erotica,
            ResourceKey.Tags_Rating_Pornographic,
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Language', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Language.Title).toBe(ResourceKey.Tags_Language);
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
            ResourceKey.Tags_Language_Multilingual,
            ResourceKey.Tags_Language_Arabic,
            ResourceKey.Tags_Language_Chinese,
            ResourceKey.Tags_Language_English,
            ResourceKey.Tags_Language_French,
            ResourceKey.Tags_Language_German,
            ResourceKey.Tags_Language_Indonesian,
            ResourceKey.Tags_Language_Italian,
            ResourceKey.Tags_Language_Japanese,
            ResourceKey.Tags_Language_Korean,
            ResourceKey.Tags_Language_Polish,
            ResourceKey.Tags_Language_Portuguese,
            ResourceKey.Tags_Language_Russian,
            ResourceKey.Tags_Language_Spanish,
            ResourceKey.Tags_Language_Thai,
            ResourceKey.Tags_Language_Turkish,
            ResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Title)).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            ResourceKey.Tags_Language_Multilingual,
            ResourceKey.Tags_Language_Arabic,
            ResourceKey.Tags_Language_Chinese,
            ResourceKey.Tags_Language_English,
            ResourceKey.Tags_Language_French,
            ResourceKey.Tags_Language_German,
            ResourceKey.Tags_Language_Indonesian,
            ResourceKey.Tags_Language_Italian,
            ResourceKey.Tags_Language_Japanese,
            ResourceKey.Tags_Language_Korean,
            ResourceKey.Tags_Language_Polish,
            ResourceKey.Tags_Language_Portuguese,
            ResourceKey.Tags_Language_Russian,
            ResourceKey.Tags_Language_Spanish,
            ResourceKey.Tags_Language_Thai,
            ResourceKey.Tags_Language_Turkish,
            ResourceKey.Tags_Language_Vietnamese,
        ];
        expect(Tags.Language.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});