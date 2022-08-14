import type { IResource } from '../ILocale';
import { en_US } from './en_US';

export const fil_PH: IResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    _: '🇵🇭 Pilipino (PH)',

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'Nagbago ang harapan. Muling-simulan ngayon para lumipat sa bagong harapan?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime at Nobel Downloader',
};