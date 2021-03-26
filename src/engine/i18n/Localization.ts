import { enUS } from './enUS';
import { deDE } from './deDE';

const locales = [
    enUS,
    deDE
];

let resources: { [key: string]: string; } | undefined = enUS.Resources;

export function localize(code: string): void {
    resources = locales.find(locale => locale.Code === code)?.Resources;
}

export function i18n(key: string, ...params: string[]): string {
    let text: string = resources ? resources[key] || key : key;
    for(const index in params) {
        const regex = new RegExp(`\\{${index}\\}`, 'g');
        text = text.replace(regex, params[index]);
    }
    return text;
}