import type { IResource } from '../ILocale';
import { en_US } from './en_US';

export const pt_BR: IResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    _: '🇧🇷 Português (BR)',

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'A fachada foi trocada. Reiniciar agora para mudar para o novo fachada?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Mangá, Anime e descarregador de Romance',
};