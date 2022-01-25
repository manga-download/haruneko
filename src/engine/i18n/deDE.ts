import type { ILocale } from './ILocale';

class GermanDE implements ILocale {
    public readonly Code = 'deDE';
    public readonly Title = 'Deutsch (DE)';
    public readonly Resources = {
        'FetchProvider.FetchWindow.TimeoutError': 'Die Anfrage konnte nicht innerhalb der angegebenen Zeitbeschränkung verarbeitet werden!',
        'FetchProvider.FetchWindow.CloudFlareError': 'Die Anfrage wurde aufgrund des folgenden CloudFlare Fehlers abgebrochen: "{0}"',
        'FetchProvider.FetchWindow.AlertCaptcha': 'Um automatisch fortzufahren ist es erforderlich den auf der Website angezeigten Captcha zu lösen (die Webseite darf nach der Lösung nicht geschlossen werde)!',
        'FrontendController.Reload.ConfirmNotice': 'Das Frontend wurde geändert. Jetzt neu starten, um das Frontend zu wechseln?',
        'Tags.Media': 'Art',
        'Tags.Media.Manga': 'Manga',
        'Tags.Media.MangaDescription': 'Manga, ...',
        'Tags.Media.Manhua': 'Manhua',
        'Tags.Media.ManhuaDescription': 'Manhua, ...',
        'Tags.Media.Manhwa': 'Manhwa',
        'Tags.Media.ManhwaDescription': 'Manhwa, ...',
        'Tags.Media.Comic': 'Comic',
        'Tags.Media.ComicDescription': 'Comic, ...',
        'Tags.Media.Anime': 'Anime',
        'Tags.Media.AnimeDescription': 'Anime, ...',
        'Tags.Media.Cartoon': 'Cartoon',
        'Tags.Media.CartoonDescription': 'Cartoon, ...',
        'Tags.Media.Novel': 'Novel',
        'Tags.Media.NovelDescription': 'Novel, ...',
        'Tags.Source': 'Quelle',
        'Tags.Source.Official': 'Official',
        'Tags.Source.Scanlator': 'Scanlator',
        'Tags.Source.Aggregator': 'Aggregator',
        'Tags.Rating': 'Einstufung',
        'Tags.Rating.Safe': 'Keine',
        'Tags.Rating.Suggestive': 'Unanständig',
        'Tags.Rating.Erotica': 'Erotisch',
        'Tags.Rating.Pornographic': 'Pornografisch',
        'Tags.Language': 'Sprache',
        'Tags.Language.Multilingual': 'Multilingual',
        'Tags.Language.Arabic': 'Arabisch',
        'Tags.Language.Chinese': 'Chinesisch',
        'Tags.Language.English': 'Englisch',
        'Tags.Language.French': 'Französisch',
        'Tags.Language.German': 'Deutsch',
        'Tags.Language.Indonesian': 'Indonesisch',
        'Tags.Language.Italian': 'Italienisch',
        'Tags.Language.Japanese': 'Japanisch',
        'Tags.Language.Korean': 'Koreanisch',
        'Tags.Language.Polish': 'Polnisch',
        'Tags.Language.Portuguese': 'Portugisisch',
        'Tags.Language.Russian': 'Russisch',
        'Tags.Language.Spanish': 'Spanisch',
        'Tags.Language.Thai': 'Thailändisch',
        'Tags.Language.Turkish': 'Türkisch',
        'Tags.Language.Vietnamese': 'Vietnamesisch',
    };
}

const deDE = new GermanDE();
export { deDE };