import type { ILocale } from './ILocale';

class EnglishUS implements ILocale {
    public readonly Code = 'enUS';
    public readonly Title = 'English (US)';
    public readonly Resources = {
        'FetchProvider.FetchWindow.TimeoutError': 'The request could not be fulfilled within the given timeout!',
        'FetchProvider.FetchWindow.CloudFlareError': 'The request failed due to the following CloudFlare Error: "{0}"',
        'FetchProvider.FetchWindow.AlertCaptcha': 'Please solve the Captcha and then wait for the application to continue (do not close the website after solving the Captcha)!',
        'FrontendController.Reload.ConfirmNotice': 'The frontend was changed. Restart now to switch to the new frontend?',
        'Tags.Media': 'Media',
        'Tags.Media.Manga': 'Manga',
        'Tags.Media.MangaDescription': 'Japan, Black & White, Single/Double Paged, ...',
        'Tags.Media.Manhua': 'Manhua',
        'Tags.Media.ManhuaDescription': 'China, Colored, Longtrip, ...',
        'Tags.Media.Manhwa': 'Manhwa',
        'Tags.Media.ManhwaDescription': 'South Korea, Colored, Longtrip, ...',
        'Tags.Media.Comic': 'Comic',
        'Tags.Media.ComicDescription': 'Western, Colored, ...',
        'Tags.Media.Anime': 'Anime',
        'Tags.Media.AnimeDescription': 'Anime, ...',
        'Tags.Media.Cartoon': 'Cartoon',
        'Tags.Media.CartoonDescription': 'Cartoon, ...',
        'Tags.Media.Novel': 'Novel',
        'Tags.Media.NovelDescription': 'Novel, ...',
        'Tags.Source': 'Source',
        'Tags.Source.Official': 'Official',
        'Tags.Source.Scanlator': 'Scanlator',
        'Tags.Source.Aggregator': 'Aggregator',
        'Tags.Rating': 'Rating',
        'Tags.Rating.Safe': 'Safe',
        'Tags.Rating.Suggestive': 'Suggestive',
        'Tags.Rating.Erotica': 'Erotica',
        'Tags.Rating.Pornographic': 'Pornographic',
        'Tags.Language': 'Language',
        'Tags.Language.Multilingual': 'Multilingual',
        'Tags.Language.Arabic': 'Arabic',
        'Tags.Language.Chinese': 'Chinese',
        'Tags.Language.English': 'English',
        'Tags.Language.French': 'French',
        'Tags.Language.German': 'German',
        'Tags.Language.Indonesian': 'Indonesian',
        'Tags.Language.Italian': 'Italian',
        'Tags.Language.Japanese': 'Japanese',
        'Tags.Language.Korean': 'Korean',
        'Tags.Language.Polish': 'Polish',
        'Tags.Language.Portuguese': 'Portuguese',
        'Tags.Language.Russian': 'Russian',
        'Tags.Language.Spanish': 'Spanish',
        'Tags.Language.Thai': 'Thai',
        'Tags.Language.Turkish': 'Turkish',
        'Tags.Language.Vietnamese': 'Vietnamese',
    };
}

const enUS = new EnglishUS();
export { enUS };