import type { IResource } from '../ILocale';
import { en_US } from './en_US';

export const tr_TR: IResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    _: '🇹🇷 Türkçe (TR)',

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'The frontend was changed. Restart now to switch to the new frontend?',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'Manga, Anime and Novel Downloader',
};