import { Tags } from './Tags';
import { enUS } from './i18n/enUS';

describe('Tags.Media', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Media.toString()).toBe(enUS.Resources['Tags.Media']);
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
            enUS.Resources['Tags.Media.Manga'],
            enUS.Resources['Tags.Media.Manhua'],
            enUS.Resources['Tags.Media.Manhwa'],
            enUS.Resources['Tags.Media.Comic'],
            enUS.Resources['Tags.Media.Anime'],
            enUS.Resources['Tags.Media.Cartoon'],
            enUS.Resources['Tags.Media.Novel'],
        ];
        expect(Tags.Media.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Media.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            enUS.Resources['Tags.Media.Manga'],
            enUS.Resources['Tags.Media.Manhua'],
            enUS.Resources['Tags.Media.Manhwa'],
            enUS.Resources['Tags.Media.Comic'],
            enUS.Resources['Tags.Media.Anime'],
            enUS.Resources['Tags.Media.Cartoon'],
            enUS.Resources['Tags.Media.Novel'],
        ].map(title => `${enUS.Resources['Tags.Media']}: ${title}`);
        expect(Tags.Media.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            enUS.Resources['Tags.Media.MangaDescription'],
            enUS.Resources['Tags.Media.ManhuaDescription'],
            enUS.Resources['Tags.Media.ManhwaDescription'],
            enUS.Resources['Tags.Media.ComicDescription'],
            enUS.Resources['Tags.Media.AnimeDescription'],
            enUS.Resources['Tags.Media.CartoonDescription'],
            enUS.Resources['Tags.Media.NovelDescription'],
        ];
        expect(Tags.Media.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Source', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Source.toString()).toBe(enUS.Resources['Tags.Source']);
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
            enUS.Resources['Tags.Source.Official'],
            enUS.Resources['Tags.Source.Scanlator'],
            enUS.Resources['Tags.Source.Aggregator'],
        ];
        expect(Tags.Source.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Source.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            enUS.Resources['Tags.Source.Official'],
            enUS.Resources['Tags.Source.Scanlator'],
            enUS.Resources['Tags.Source.Aggregator'],
        ].map(title => `${enUS.Resources['Tags.Source']}: ${title}`);
        expect(Tags.Source.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            enUS.Resources['Tags.Source.Official'],
            enUS.Resources['Tags.Source.Scanlator'],
            enUS.Resources['Tags.Source.Aggregator'],
        ];
        expect(Tags.Source.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Rating', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Rating.toString()).toBe(enUS.Resources['Tags.Rating']);
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
            enUS.Resources['Tags.Rating.Safe'],
            enUS.Resources['Tags.Rating.Suggestive'],
            enUS.Resources['Tags.Rating.Erotica'],
            enUS.Resources['Tags.Rating.Pornographic'],
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Rating.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            enUS.Resources['Tags.Rating.Safe'],
            enUS.Resources['Tags.Rating.Suggestive'],
            enUS.Resources['Tags.Rating.Erotica'],
            enUS.Resources['Tags.Rating.Pornographic'],
        ].map(title => `${enUS.Resources['Tags.Rating']}: ${title}`);
        expect(Tags.Rating.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            enUS.Resources['Tags.Rating.Safe'],
            enUS.Resources['Tags.Rating.Suggestive'],
            enUS.Resources['Tags.Rating.Erotica'],
            enUS.Resources['Tags.Rating.Pornographic'],
        ];
        expect(Tags.Rating.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});

describe('Tags.Language', () => {

    it('Should default to english category title', async () => {
        expect(Tags.Language.toString()).toBe(enUS.Resources['Tags.Language']);
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
            enUS.Resources['Tags.Language.Multilingual'],
            enUS.Resources['Tags.Language.Arabic'],
            enUS.Resources['Tags.Language.Chinese'],
            enUS.Resources['Tags.Language.English'],
            enUS.Resources['Tags.Language.French'],
            enUS.Resources['Tags.Language.German'],
            enUS.Resources['Tags.Language.Indonesian'],
            enUS.Resources['Tags.Language.Italian'],
            enUS.Resources['Tags.Language.Japanese'],
            enUS.Resources['Tags.Language.Korean'],
            enUS.Resources['Tags.Language.Polish'],
            enUS.Resources['Tags.Language.Portuguese'],
            enUS.Resources['Tags.Language.Russian'],
            enUS.Resources['Tags.Language.Spanish'],
            enUS.Resources['Tags.Language.Thai'],
            enUS.Resources['Tags.Language.Turkish'],
            enUS.Resources['Tags.Language.Vietnamese'],
        ];
        expect(Tags.Language.toArray().map(tag => tag.Title)).toStrictEqual(expected);
        expect(Tags.Language.toArray().map(tag => `${tag}`)).toStrictEqual(expected);
    });

    it('Should default to english tag titles with correct formatting', async () => {
        const expected = [
            enUS.Resources['Tags.Language.Multilingual'],
            enUS.Resources['Tags.Language.Arabic'],
            enUS.Resources['Tags.Language.Chinese'],
            enUS.Resources['Tags.Language.English'],
            enUS.Resources['Tags.Language.French'],
            enUS.Resources['Tags.Language.German'],
            enUS.Resources['Tags.Language.Indonesian'],
            enUS.Resources['Tags.Language.Italian'],
            enUS.Resources['Tags.Language.Japanese'],
            enUS.Resources['Tags.Language.Korean'],
            enUS.Resources['Tags.Language.Polish'],
            enUS.Resources['Tags.Language.Portuguese'],
            enUS.Resources['Tags.Language.Russian'],
            enUS.Resources['Tags.Language.Spanish'],
            enUS.Resources['Tags.Language.Thai'],
            enUS.Resources['Tags.Language.Turkish'],
            enUS.Resources['Tags.Language.Vietnamese'],
        ].map(title => `${enUS.Resources['Tags.Language']}: ${title}`);
        expect(Tags.Language.toArray().map(tag => tag.toString('%C: %T'))).toStrictEqual(expected);
    });

    it('Should default to english tag descriptions', async () => {
        const expected = [
            enUS.Resources['Tags.Language.Multilingual'],
            enUS.Resources['Tags.Language.Arabic'],
            enUS.Resources['Tags.Language.Chinese'],
            enUS.Resources['Tags.Language.English'],
            enUS.Resources['Tags.Language.French'],
            enUS.Resources['Tags.Language.German'],
            enUS.Resources['Tags.Language.Indonesian'],
            enUS.Resources['Tags.Language.Italian'],
            enUS.Resources['Tags.Language.Japanese'],
            enUS.Resources['Tags.Language.Korean'],
            enUS.Resources['Tags.Language.Polish'],
            enUS.Resources['Tags.Language.Portuguese'],
            enUS.Resources['Tags.Language.Russian'],
            enUS.Resources['Tags.Language.Spanish'],
            enUS.Resources['Tags.Language.Thai'],
            enUS.Resources['Tags.Language.Turkish'],
            enUS.Resources['Tags.Language.Vietnamese'],
        ];
        expect(Tags.Language.toArray().map(tag => tag.Description)).toStrictEqual(expected);
    });
});