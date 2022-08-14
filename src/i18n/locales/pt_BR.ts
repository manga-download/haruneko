import type { IVariantResource } from '../ILocale';
import { en_US } from './en_US';

export const pt_BR: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'A fachada foi trocada. Reiniciar agora para mudar para o novo fachada?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Mangá, Anime e descarregador de Romance',
};