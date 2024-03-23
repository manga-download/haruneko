import type { IFrontendInfo } from '../IFrontend';
import { FrontendResourceKey as R } from '../../i18n/ILocale';

export const Info: IFrontendInfo = {
    ID: 'fluent-core',
    Label: R.Frontend_FluentCore_Label,
    Description: R.Frontend_FluentCore_Description,
    Screenshots: [],
    LoadModule: async () => (await import('./FrontendFluentCore')).default
};