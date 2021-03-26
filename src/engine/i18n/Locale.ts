export abstract class Locale {
    public abstract readonly Code: string = 'und';
    public abstract readonly Title: string = 'Undefined (XX)';
    public abstract readonly Resources = {
        'RequestProvider.FetchWindow.TimeoutError': '【 RequestProvider.FetchWindow.TimeoutError 】'
    }
}