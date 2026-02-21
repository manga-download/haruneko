import { DI } from '@microsoft/fast-element/di.js';
import { observable } from '@microsoft/fast-element';
import { GetLocale } from '../../../i18n/Localization';
import { SettingsManagerRegistration, type ISettingsManager } from './SettingsManager';

export class LocalizationProvider {

    @observable Locale = GetLocale();

    constructor (@SettingsManagerRegistration private readonly SettingsManager: ISettingsManager) {
        this.SettingsManager.SettingLanguage.Subscribe(() => this.Locale = GetLocale());
    }

    public Get(key: string, ...params: string[]) {
        return this.Locale[ key ](...params);
    }
}

export type { LocalizationProvider as ILocalizationProvider };
export const LocalizationProviderRegistration = DI.createContext<LocalizationProvider>();