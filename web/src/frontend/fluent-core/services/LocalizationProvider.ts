import { observable } from "@microsoft/fast-element";
import { DI, Registration } from "@microsoft/fast-element/di.js";
import { GetLocale } from '../../../i18n/Localization';
import { SettingsManagerRegistration, type SettingsManager } from './SettingsManager';

class LocalizationProvider {

    @SettingsManagerRegistration SettingsManager: SettingsManager;
    @observable Locale = GetLocale();

    constructor () {
        this.SettingsManager.SettingLanguage.Subscribe(() => this.Locale = GetLocale());
    }

    public Get(key: string, ...params: string[]) {
        return this.Locale[ key ](...params);
    }
}

export type { LocalizationProvider };
export const LocalizationProviderRegistration = DI.createContext<LocalizationProvider>();
DI.getOrCreateDOMContainer(document.body).register(Registration.instance(LocalizationProviderRegistration, new LocalizationProvider()));