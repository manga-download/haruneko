import { type ILocale, type IVariantResource, LocaleID, InvariantResourceKey, VariantResourceKey } from './ILocale';
import type { Choice } from '../engine/SettingsManager';
import { Scope, Key } from '../engine/SettingsGlobal';
import { invariant } from './locales/_invariant';
import ar_SA from './locales/ar_SA';
import de_DE from './locales/de_DE';
import en_US from './locales/en_US';
import es_ES from './locales/es_ES';
import fil_PH from './locales/fil_PH';
import fr_FR from './locales/fr_FR';
import in_ID from './locales/in_ID';
import pt_PT from './locales/pt_PT';
import ru_RU from './locales/ru_RU';
import th_TH from './locales/th_TH';
import tr_TR from './locales/tr_TR';
import zh_CN from './locales/zh_CN';

/**
 * List of all available localizations in the application.
 * See: https://www.localeplanet.com/icu/
 */
const resources: Record<LocaleID, ILocale> = {
    Locale_arSA: CreateLocale(ar_SA),
    Locale_deDE: CreateLocale(de_DE),
    Locale_enUS: CreateLocale(en_US),
    Locale_esES: CreateLocale(es_ES),
    Locale_filPH: CreateLocale(fil_PH),
    Locale_frFR: CreateLocale(fr_FR),
    Locale_inID: CreateLocale(in_ID),
    Locale_ptPT: CreateLocale(pt_PT),
    Locale_ruRU: CreateLocale(ru_RU),
    Locale_thTH: CreateLocale(th_TH),
    Locale_trTR: CreateLocale(tr_TR),
    Locale_zhCN: CreateLocale(zh_CN),
};

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

export function CreateLocale(resource: IVariantResource): ILocale {
    const result: Record<string, typeof Format> = {};
    for(const key in LocaleID) {
        result[key] = Format.bind(invariant[key]);
    }
    for(const key in InvariantResourceKey) {
        result[key] = Format.bind(invariant[key]);
    }
    for(const key in VariantResourceKey) {
        result[key] = Format.bind(resource[key]);
    }
    return result as ILocale;
}

/**
 * Search the localized resource for the given language code.
 * If no language code is given, it is determined from the global settings.
 */
export function GetLocale(code: LocaleID = null): ILocale {
    if(code) {
        return resources[code];
    } else {
        const active = HakuNeko.SettingsManager.OpenScope(Scope).Get<Choice>(Key.Language).Value as LocaleID;
        return resources[active];
    }
}