import type { IVariantResource } from '../ILocale';
import base from './en_US';

const translations: IVariantResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...base,

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: '前端已更改。是否立即重新启动以切换到新的前端？',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: '漫画，动漫和小说下载器',
};

export default translations;