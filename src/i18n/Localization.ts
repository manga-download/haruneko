import { Code, type ILocale, type IResource, ResourceKey } from './ILocale';
import type { Choice } from '../engine/SettingsManager';
import { Scope, Key } from '../engine/SettingsGlobal';
import { ar_AE } from './locales/ar_AE';
import { de_DE } from './locales/de_DE';
import { en_US } from './locales/en_US';
import { es_ES } from './locales/es_ES';
import { fil_PH } from './locales/fil_PH';
import { fr_FR } from './locales/fr_FR';
import { in_ID } from './locales/in_ID';
import { pt_BR } from './locales/pt_BR';
import { ru_RU } from './locales/ru_RU';
import { th_TH } from './locales/th_TH';
import { tr_TR } from './locales/tr_TR';
import { zh_CN } from './locales/zh_CN';

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
 * See: https://www.localeplanet.com/icu/
 * NOTE: Available languages must also be exposed in global settings
 */
const localizations = {
    [Code.ar_AE]: CreateLocale(ar_AE),
    [Code.de_DE]: CreateLocale(de_DE),
    [Code.en_US]: CreateLocale(en_US),
    [Code.es_ES]: CreateLocale(es_ES),
    [Code.fil_PH]: CreateLocale(fil_PH),
    [Code.fr_FR]: CreateLocale(fr_FR),
    [Code.in_ID]: CreateLocale(in_ID),
    [Code.pt_BR]: CreateLocale(pt_BR),
    [Code.ru_RU]: CreateLocale(ru_RU),
    [Code.th_TH]: CreateLocale(th_TH),
    [Code.tr_TR]: CreateLocale(tr_TR),
    [Code.zh_CN]: CreateLocale(zh_CN),
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