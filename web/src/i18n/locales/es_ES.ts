import type { IVariantResource } from '../ILocale';
import base from './en_US';

const translations: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...base,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'Se cambió el frontend. ¿Reiniciar ahora para cambiar al nuevo frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Descargador de manga, anime y novelas',
};

export default translations;