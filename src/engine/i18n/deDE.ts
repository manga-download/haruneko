import { Locale } from './Locale';

class GermanDE extends Locale {
    public readonly Code = 'deDE';
    public readonly Title = 'Deutsch (DE)';
    public readonly Resources = {
        'FetchProvider.FetchWindow.TimeoutError': 'Die Anfrage konnte nicht innerhalb der angegebenen Zeitbeschränkung verarbeitet werden!',
        'FetchProvider.FetchWindow.CloudFlareError': 'Die Anfrage wurde aufgrund des folgenden CloudFlare Fehlers abgebrochen: "{0}"',
        'FetchProvider.FetchWindow.AlertCaptcha': 'Um automatisch fortzufahren ist es erforderlich den auf der Website angezeigten Captcha zu lösen (die Webseite darf nach der Lösung nicht geschlossen werde)!'
    };
}

const deDE = new GermanDE();
export { deDE };