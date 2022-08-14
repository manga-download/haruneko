import type { IVariantResource } from '../ILocale';
import { en_US } from './en_US';

export const es_ES: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'Se cambió el frontend. ¿Reiniciar ahora para cambiar al nuevo frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Descargador de manga, anime y novelas',
};