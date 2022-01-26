import type { ILocale, IResources, ResourceKeys } from './ILocale';
import { en_US } from './enUS';
import { de_DE } from './deDE';

// See: https://saimana.com/list-of-country-locale-code/
const locales: ILocale[] = [
    en_US,
    de_DE
];

let resources: IResources = en_US.Resources;

export function localize(code: string): void {
    resources = locales.find(locale => locale.Code === code)?.Resources;
}

export function i18n(key: ResourceKeys | string, ...params: string[]): string {
    let text: string = resources[key] || `【 ${key} 】`;
    for(const index in params) {
        const regex = new RegExp(`\\{${index}\\}`, 'g');
        text = text.replace(regex, params[index]);
    }
    return text;
}