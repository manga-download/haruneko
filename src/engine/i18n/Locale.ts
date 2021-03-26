export abstract class Locale {
    public abstract readonly Code: string = 'und';
    public abstract readonly Title: string = 'Undefined (XX)';
    public abstract readonly Resources = {
        'FetchProvider.FetchWindow.TimeoutError': '【 FetchProvider.FetchWindow.TimeoutError 】',
        'FetchProvider.FetchWindow.CloudFlareError': '【 FetchProvider.FetchWindow.CloudFlareError 】\n{0}',
        'FetchProvider.FetchWindow.AlertCaptcha': '【 FetchProvider.FetchWindow.AlertCaptcha 】'
    }
}