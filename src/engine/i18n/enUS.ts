import { Locale } from './Locale';

class EnglishUS extends Locale {
    public readonly Code = 'enUS';
    public readonly Title = 'English (US)';
    public readonly Resources = {
        'FetchProvider.FetchWindow.TimeoutError': 'The request could not be fulfilled within the given timeout!',
        'FetchProvider.FetchWindow.CloudFlareError': 'The request failed due to the following CloudFlare Error: "{0}"',
        'FetchProvider.FetchWindow.AlertCaptcha': 'Please solve the Captcha and then wait for the application to continue (do not close the website after solving the Captcha)!'
    };
}

const enUS = new EnglishUS();
export { enUS };