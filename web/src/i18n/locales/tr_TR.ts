import type { IVariantResource } from '../ILocale';
import base from './en_US';

const translations: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...base,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'The frontend was changed. Restart now to switch to the new frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime and Novel Downloader',
};

export default translations;