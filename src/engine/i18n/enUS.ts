import { Locale } from './Locale';

class EnglishUS extends Locale {
    public readonly Code = 'enUS';
    public readonly Title = 'English (US)';
    public readonly Resources = {
        'RequestProvider.FetchWindow.TimeoutError': 'The request could not be fulfilled within the given timeout!'
    };
}

const enUS = new EnglishUS();
export { enUS };