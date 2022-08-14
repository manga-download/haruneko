import type { IVariantResource } from '../ILocale';
import { en_US } from './en_US';

export const zh_CN: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: '前端已更改。是否立即重新启动以切换到新的前端？',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: '漫画，动漫和小说下载器',
};