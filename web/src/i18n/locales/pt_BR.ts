import type { IVariantResource } from '../ILocale';
import base from './en_US';

const translations: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...base,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'A fachada foi trocada. Reiniciar agora para mudar para o novo fachada?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Mangá, Anime e descarregador de Romance',
};

export default translations;