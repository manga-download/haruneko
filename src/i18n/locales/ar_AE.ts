import type { IResource } from '../ILocale';
import { en_US } from './en_US';

export const ar_AE: IResource = {
    // NOTE: Use defaults from 'en_US' for missing translations
    //       => can be removed when translation is complete
    ...en_US,

    _: '🇦🇪 العربية (AE)',

    // [SECTION]: FrontendController

    FrontendController_Reload_ConfirmNotice: 'تم تغيير الواجهة الأمامية. أعد التشغيل الآن للتبديل إلى الواجهة الأمامية الجديدة؟',

    // [SECTION]: Frontend (Common/Shared)

    Frontend_Product_Title: 'HakuNeko',
    Frontend_Product_Description: 'مانغا وأنيمي ورواية داونلودر',
};