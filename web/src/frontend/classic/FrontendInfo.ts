import type { IFrontendInfo } from '../IFrontend';
import { FrontendResourceKey as R } from '../../i18n/ILocale';

export const Info: IFrontendInfo = {
    ID: 'classic',
    Label: R.Frontend_Classic_Label,
    Description: R.Frontend_Classic_Description,
    Screenshots: [],
    LoadModule: async () => (await import('./FrontendClassic')).default
};