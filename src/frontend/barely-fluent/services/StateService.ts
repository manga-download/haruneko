import { observable } from '@microsoft/fast-element';
import type { Choice } from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { GetLocale } from '../../../i18n/Localization';

class StateService {

    constructor() {
        HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).ValueChanged.Subscribe(() => this.Locale = GetLocale());
    }

    @observable Locale = GetLocale();
}

export default new StateService();