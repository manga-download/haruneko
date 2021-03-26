import { Locale } from './Locale';

class GermanDE extends Locale {
    public readonly Code = 'deDE';
    public readonly Title = 'Deutsch (DE)';
    public readonly Resources = {
        'RequestProvider.FetchWindow.TimeoutError': 'Die Anfrage konnte nicht innerhalb der angegebenen Zeitbeschränkung verarbeitet werden!'
    };
}

const deDE = new GermanDE();
export { deDE };