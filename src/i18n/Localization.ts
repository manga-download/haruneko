import { Code, type ILocale, type IResource, ResourceKey } from './ILocale';
import { en_US } from './locales/en_US';
import { fr_FR } from './locales/fr_FR';
import { de_DE } from './locales/de_DE';
import { Scope, Key } from '../engine/SettingsGlobal';
import type { Choice } from '../engine/SettingsManager';

function Format(this: string, ...params: string[]) {
    let text = this.toString();
    for(const index in params) {
        text = text.replace(`{${index}}`, params[index]);
        /*
        const regex = new RegExp(`\\{${index}\\}`, 'g');
        text = text.replace(regex, params[index]);
        */
    }
    return text;
}

export function CreateLocale(resource: IResource): ILocale {
    const result: Record<string, typeof Format> = {};
    for(const key in ResourceKey) {
        result[key] = Format.bind(resource[key as ResourceKey]);
    }
    return result as ILocale;
}

/**
 * List of all available localizations in the application.
 * See: https://saimana.com/list-of-country-locale-code/
 * NOTE: Available languages must also be exposed in global settings
 */
const localizations = {
    [Code.en_US]: CreateLocale(en_US),
    [Code.fr_FR]: CreateLocale(fr_FR),
    [Code.de_DE]: CreateLocale(de_DE),
};

/**
 * Search the localized resource for the given language code.
 * If no language code is given, it is determined from the global settings.
 */
export function GetLocale(code: Code = null): ILocale {
    if(code) {
        return localizations[code];
    } else {
        const active = HakuNeko.SettingsManager.OpenScope(Scope).Get<Choice>(Key.Language).Value as Code;
        return localizations[active];
    }
}