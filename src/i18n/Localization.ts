import { Code, type ILocale, type IResource, ResourceKey } from './ILocale';
import { en_US } from './locales/en_US';
import { fr_FR } from './locales/fr_FR';
import { de_DE } from './locales/de_DE';

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

export function CreateLocale(name: string, resource: IResource): ILocale {
    const result: Record<string, typeof Format> = {};
    for(const key in ResourceKey) {
        result[key] = Format.bind(resource[key as ResourceKey]);
    }
    result.toString = () => name;
    return result as ILocale;
}

export function CurrentLocale(): Code {
    // TODO: Determine user selected langauge code from settings,
    //       which may be changed by e.g. HakuNeko.EventManager.LocaleChanged
    return Code.en_US;
}

/**
 * List of all available localizations in the application.
 * See: https://saimana.com/list-of-country-locale-code/
 */
export const Localizations: Record<Code, ILocale> & Iterable<{ key: Code, label: ResourceKey }> = {
    [Code.en_US]: CreateLocale('🇺🇸 English (US)', en_US),
    [Code.fr_FR]: CreateLocale('🇫🇷 Français (FR)', fr_FR),
    [Code.de_DE]: CreateLocale('🇩🇪 Deutsch (DE)', de_DE),
    *[Symbol.iterator]() {
        for(const key in this) {
            yield {
                key: key as Code,
                label: this[key as Code].toString() as ResourceKey
            };
        }
    }
};

/**
 * Get the localized resource based on the user configured language code.
 * This method may be used in places where the text is generated on the fly (e.g. getter properties, error messages),
 * or must not immediately reflect when the user canges the language code configuration.
 */
export function I(): ILocale {
    return Localizations[CurrentLocale()];
}

/**
 * Search the localized resource for the given language code.
 * This method may be used in reactive statements depending on the langauge code (e.g. frontend),
 * or in places where an explicit langauge code shall be used (e.g. error traces).
 */
export function L(code: Code): ILocale {
    return Localizations[code];
}