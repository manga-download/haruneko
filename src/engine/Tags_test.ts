import { Tags } from './Tags';
import { en_US } from './i18n/locales/en_US';
import { ResourceKeys } from './i18n/ILocale';

describe('Tags.Media', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Media.toString()).toBe(en_US.Resources[ResourceKeys.Tags_Media]);
        expect(Tags.Media.toArray().every(tag => tag.Category === `${Tags.Media}`)).toBeTruthy();
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
            en_US.Resources[ResourceKeys.Tags_Media_Manga],
            en_US.Resources[ResourceKeys.Tags_Media_Manhua],
            en_US.Resources[ResourceKeys.Tags_Media_Manhwa],
            en_US.Resources[ResourceKeys.Tags_Media_Comic],
            en_US.Resources[ResourceKeys.Tags_Media_Anime],
            en_US.Resources[ResourceKeys.Tags_Media_Cartoon],
            en_US.Resources[ResourceKeys.Tags_Media_Novel],
        ];
        expect(Tags.Media.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Media.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Media_Manga],
            en_US.Resources[ResourceKeys.Tags_Media_Manhua],
            en_US.Resources[ResourceKeys.Tags_Media_Manhwa],
            en_US.Resources[ResourceKeys.Tags_Media_Comic],
            en_US.Resources[ResourceKeys.Tags_Media_Anime],
            en_US.Resources[ResourceKeys.Tags_Media_Cartoon],
            en_US.Resources[ResourceKeys.Tags_Media_Novel],
        ].map(title => `${en_US.Resources[ResourceKeys.Tags_Media]}: ${title}`);
        expect(Tags.Media.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Media_MangaDescription],
            en_US.Resources[ResourceKeys.Tags_Media_ManhuaDescription],
            en_US.Resources[ResourceKeys.Tags_Media_ManhwaDescription],
            en_US.Resources[ResourceKeys.Tags_Media_ComicDescription],
            en_US.Resources[ResourceKeys.Tags_Media_AnimeDescription],
            en_US.Resources[ResourceKeys.Tags_Media_CartoonDescription],
            en_US.Resources[ResourceKeys.Tags_Media_NovelDescription],
        ];
        expect(Tags.Media.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Source', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Source.toString()).toBe(en_US.Resources[ResourceKeys.Tags_Source]);
        expect(Tags.Source.toArray().every(tag => tag.Category === `${Tags.Source}`)).toBeTruthy();
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
            en_US.Resources[ResourceKeys.Tags_Source_Official],
            en_US.Resources[ResourceKeys.Tags_Source_Scanlator],
            en_US.Resources[ResourceKeys.Tags_Source_Aggregator],
        ];
        expect(Tags.Source.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Source.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Source_Official],
            en_US.Resources[ResourceKeys.Tags_Source_Scanlator],
            en_US.Resources[ResourceKeys.Tags_Source_Aggregator],
        ].map(title => `${en_US.Resources[ResourceKeys.Tags_Source]}: ${title}`);
        expect(Tags.Source.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Source_Official],
            en_US.Resources[ResourceKeys.Tags_Source_Scanlator],
            en_US.Resources[ResourceKeys.Tags_Source_Aggregator],
        ];
        expect(Tags.Source.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Rating', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Rating.toString()).toBe(en_US.Resources[ResourceKeys.Tags_Rating]);
        expect(Tags.Rating.toArray().every(tag => tag.Category === `${Tags.Rating}`)).toBeTruthy();
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
            en_US.Resources[ResourceKeys.Tags_Rating_Safe],
            en_US.Resources[ResourceKeys.Tags_Rating_Suggestive],
            en_US.Resources[ResourceKeys.Tags_Rating_Erotica],
            en_US.Resources[ResourceKeys.Tags_Rating_Pornographic],
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Rating.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Rating_Safe],
            en_US.Resources[ResourceKeys.Tags_Rating_Suggestive],
            en_US.Resources[ResourceKeys.Tags_Rating_Erotica],
            en_US.Resources[ResourceKeys.Tags_Rating_Pornographic],
        ].map(title => `${en_US.Resources[ResourceKeys.Tags_Rating]}: ${title}`);
        expect(Tags.Rating.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Rating_Safe],
            en_US.Resources[ResourceKeys.Tags_Rating_Suggestive],
            en_US.Resources[ResourceKeys.Tags_Rating_Erotica],
            en_US.Resources[ResourceKeys.Tags_Rating_Pornographic],
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Language', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Language.toString()).toBe(en_US.Resources[ResourceKeys.Tags_Language]);
        expect(Tags.Language.toArray().every(tag => tag.Category === `${Tags.Language}`)).toBeTruthy();
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
            en_US.Resources[ResourceKeys.Tags_Language_Multilingual],
            en_US.Resources[ResourceKeys.Tags_Language_Arabic],
            en_US.Resources[ResourceKeys.Tags_Language_Chinese],
            en_US.Resources[ResourceKeys.Tags_Language_English],
            en_US.Resources[ResourceKeys.Tags_Language_French],
            en_US.Resources[ResourceKeys.Tags_Language_German],
            en_US.Resources[ResourceKeys.Tags_Language_Indonesian],
            en_US.Resources[ResourceKeys.Tags_Language_Italian],
            en_US.Resources[ResourceKeys.Tags_Language_Japanese],
            en_US.Resources[ResourceKeys.Tags_Language_Korean],
            en_US.Resources[ResourceKeys.Tags_Language_Polish],
            en_US.Resources[ResourceKeys.Tags_Language_Portuguese],
            en_US.Resources[ResourceKeys.Tags_Language_Russian],
            en_US.Resources[ResourceKeys.Tags_Language_Spanish],
            en_US.Resources[ResourceKeys.Tags_Language_Thai],
            en_US.Resources[ResourceKeys.Tags_Language_Turkish],
            en_US.Resources[ResourceKeys.Tags_Language_Vietnamese],
        ];
        expect(Tags.Language.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Language.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Language_Multilingual],
            en_US.Resources[ResourceKeys.Tags_Language_Arabic],
            en_US.Resources[ResourceKeys.Tags_Language_Chinese],
            en_US.Resources[ResourceKeys.Tags_Language_English],
            en_US.Resources[ResourceKeys.Tags_Language_French],
            en_US.Resources[ResourceKeys.Tags_Language_German],
            en_US.Resources[ResourceKeys.Tags_Language_Indonesian],
            en_US.Resources[ResourceKeys.Tags_Language_Italian],
            en_US.Resources[ResourceKeys.Tags_Language_Japanese],
            en_US.Resources[ResourceKeys.Tags_Language_Korean],
            en_US.Resources[ResourceKeys.Tags_Language_Polish],
            en_US.Resources[ResourceKeys.Tags_Language_Portuguese],
            en_US.Resources[ResourceKeys.Tags_Language_Russian],
            en_US.Resources[ResourceKeys.Tags_Language_Spanish],
            en_US.Resources[ResourceKeys.Tags_Language_Thai],
            en_US.Resources[ResourceKeys.Tags_Language_Turkish],
            en_US.Resources[ResourceKeys.Tags_Language_Vietnamese],
        ].map(title => `${en_US.Resources[ResourceKeys.Tags_Language]}: ${title}`);
        expect(Tags.Language.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            en_US.Resources[ResourceKeys.Tags_Language_Multilingual],
            en_US.Resources[ResourceKeys.Tags_Language_Arabic],
            en_US.Resources[ResourceKeys.Tags_Language_Chinese],
            en_US.Resources[ResourceKeys.Tags_Language_English],
            en_US.Resources[ResourceKeys.Tags_Language_French],
            en_US.Resources[ResourceKeys.Tags_Language_German],
            en_US.Resources[ResourceKeys.Tags_Language_Indonesian],
            en_US.Resources[ResourceKeys.Tags_Language_Italian],
            en_US.Resources[ResourceKeys.Tags_Language_Japanese],
            en_US.Resources[ResourceKeys.Tags_Language_Korean],
            en_US.Resources[ResourceKeys.Tags_Language_Polish],
            en_US.Resources[ResourceKeys.Tags_Language_Portuguese],
            en_US.Resources[ResourceKeys.Tags_Language_Russian],
            en_US.Resources[ResourceKeys.Tags_Language_Spanish],
            en_US.Resources[ResourceKeys.Tags_Language_Thai],
            en_US.Resources[ResourceKeys.Tags_Language_Turkish],
            en_US.Resources[ResourceKeys.Tags_Language_Vietnamese],
        ];
        expect(Tags.Language.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});