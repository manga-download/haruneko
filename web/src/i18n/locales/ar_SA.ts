import type { VariantResource } from '../ILocale'; // HACK: Import a reference to the en-US tranlsation itself, so the auto-generated translation files are based on the en-US translation

import enUS from './en_US';
/**
 * Get the en-US translation map, or an empty map in case of a circular (self) reference
 */

function base() {
  try {
    return enUS;
  } catch (error) {
    if (error instanceof ReferenceError) {
      return {};
    } else {
      throw error;
    }
  }
}

const translations: VariantResource = { // NOTE: Use defaults for missing translations
  //       => This is just a placeholder to ensure to be included in auto-generated translations (e.g., with crowdin)
  ...(base() as VariantResource),
  // [SECTION]: FrontendController
  FrontendController_Reload_ConfirmNotice: 'A restart is required in order to apply the requested changes.\nAny unsaved changes will be lost and active operations (e.g., downloads) will be aborted!\n\nDo you want to perform a restart now?',
  // [SECTION]: Frontend (Common/Shared)
  Frontend_Product_Title: 'HakuNeko',
  Frontend_Product_Description: 'Manga, Anime and Novel Downloader',
  Frontend_Setting: "الإعداد",
  Frontend_Settings: "الاعدادات",
  Frontend_Help: "المساعدة",
  Frontend_About: "حول",
  Frontend_Plugin: "الإضافات",
  Frontend_Plugins: "الإضافات",
  Frontend_Plugin_List: "قائمة الإضافات",
  Frontend_Plugin_Select: "حدد البرنامج المساعد",
  Frontend_Plugin_Selection: "تحديد المكون الإضافي",
  Frontend_Media: "الوسائط",
  Frontend_Medias: "الوسائط",
  Frontend_Media_List: "قائمة الوسائط",
  Frontend_Media_Select: "تحديد وسائط",
  Frontend_Media_Selection: "اختيار الوسائط",
  Frontend_Media_PasteLink_NotFoundError: "الرابط الذي تم توفيره غير مدعوم (لم يتم العثور على موقع مطابق): {0}",
  Frontend_Item: "البند",
  Frontend_Items: "عناصر",
  Frontend_Item_List: "قائمة العناصر",
  Frontend_Item_Select: "حدد عنصر",
  Frontend_Item_Selection: "اختيار العناصر",
  // [SECTION]: Frontend Classic
  Frontend_Classic_Label: "كلاسيكي",
  Frontend_Classic_Description: "الجبهة القياسية تستند في معظمها إلى النسخة السابقة",
  Frontend_Classic_Settings_FuzzySearch: "بحث غامض",
  Frontend_Classic_Settings_FuzzySearchInfo: "تمكين البحث الغامض على عوامل التصفية (المطابقة التقريبية)",
  Frontend_Classic_Settings_Theme: "السمة",
  Frontend_Classic_Settings_ThemeInfo: "حدد سمة اللون لواجهة المستخدم",
  Frontend_Classic_Settings_Theme_HakuNeko: 'HakuNeko',
  Frontend_Classic_Settings_Theme_CarbonWhite: "أبيض كربون",
  Frontend_Classic_Settings_Theme_CarbonG10: "كربون ج10 (خفيف)",
  Frontend_Classic_Settings_Theme_CarbonG90: "كربون ج90 (داكن)",
  Frontend_Classic_Settings_Theme_CarbonG100: "كربون ج100 (داكن)",
  Frontend_Classic_Settings_Theme_SheepyNeko: "شيبينيكو",
  Frontend_Classic_Settings_ContentPanel: "لوحة المحتوى",
  Frontend_Classic_Settings_ContentPanelInfo: "تعيين لإظهار/إخفاء لوحة المحتوى",
  Frontend_Classic_Settings_SidenavTrail: "تمكين مسار جانبي",
  Frontend_Classic_Settings_SidenavTrailInfo: "الجانب الأيسر سيظهر فقط في أعلى أيقونة على اليسار",
  Frontend_Classic_Settings_SidenavIconsOnTop: "أيقونات القائمة في الأعلى",
  Frontend_Classic_Settings_SidenavIconsOnTopInfo: "ستظهر أزرار المنزل والإضافات في الأعلى بدلاً من الجانب.",
  Frontend_Classic_Settings_ViewerMode: "وضع العارض",
  Frontend_Classic_Settings_ViewerModeInfo: "تغيير كيفية عرض الصفحات/الصور في القارئ",
  Frontend_Classic_Settings_ViewerMode_Paginated: "صفيح (مانغا)",
  Frontend_Classic_Settings_ViewerMode_Longstrip: "الشريط الطويل (ويبتون)",
  Frontend_Classic_Settings_ViewerReverseDirection: "عكس اتجاه القراءة",
  Frontend_Classic_Settings_ViewerReverseDirectionInfo: "إظهار الصفحات/الصور بالترتيب العكسي (مثل في Traional Manga)",
  Frontend_Classic_Settings_ViewerDoublePage: "إظهار صفحات مزدوجة",
  Frontend_Classic_Settings_ViewerDoublePageInfo: "إظهار صفحتين/صورتين في وقت واحد (مثل في Traional Manga)",
  Frontend_Classic_Sidenav_Home: "الصفحة الرئيسية",
  Frontend_Classic_Sidenav_Settings_General: "عام",
  Frontend_Classic_Sidenav_Settings_Interface: "الواجهة",
  Frontend_Classic_Sidenav_Settings_Trackers: "المتتبعون",
  Frontend_Classic_Sidenav_Settings_Network: "الشبكة",
  // [SECTION]: Frontend FluentCore
  Frontend_FluentCore_Label: "نواة فلورية",
  Frontend_FluentCore_Description: "واجهة بسيطة بدون أجراس أو مصفوفات، خاصة للمطورين للتحقق بسرعة من الوظائف الأساسية",
  //
  Frontend_FluentCore_Window_ButtonMinimize_Description: "تصغير التطبيق",
  Frontend_FluentCore_Window_ButtonMaximize_Description: "تعظيم التطبيق",
  Frontend_FluentCore_Window_ButtonRestore_Description: "استعادة التطبيق",
  Frontend_FluentCore_Window_ButtonClose_Description: "إغلاق التطبيق",
  //
  Frontend_FluentCore_Menu_Description: "إظهار قائمة التطبيق",
  Frontend_FluentCore_Menu_OpenSettings_Label: "الإعدادات…",
  Frontend_FluentCore_Menu_OpenSettings_Description: "تعديل إعدادات التطبيق",
  Frontend_FluentCore_Menu_ImportBookmarks_Label: "استيراد الإشارات المرجعية…",
  Frontend_FluentCore_Menu_ImportBookmarks_Description: "استيراد جميع الإشارات المرجعية من ملف (سيتم حفظ الإشارات المرجعية الموجودة)",
  Frontend_FluentCore_Menu_ExportBookmarks_Label: "تصدير الإشارات المرجعية…",
  Frontend_FluentCore_Menu_ExportBookmarks_Description: "تصدير جميع الإشارات المرجعية إلى ملف (على سبيل المثال للنسخ الاحتياطي)",
  //
  Frontend_FluentCore_Settings_ThemeLuminance_Label: "تمزيق السمة",
  Frontend_FluentCore_Settings_ThemeLuminance_Description: "تغيير الضوء/الظلام للموضوع",
  Frontend_FluentCore_Settings_ShowBookmarksPanel_Label: "قائمة الإشارات المرجعية",
  Frontend_FluentCore_Settings_ShowBookmarksPanel_Description: "تبديل رؤية قائمة الإشارات المرجعية تشغيل/إيقاف تشغيلها",
  Frontend_FluentCore_Settings_ShowDownloadsPanel_Label: "إدارة التنزيل",
  Frontend_FluentCore_Settings_ShowDownloadsPanel_Description: "تبديل رؤية مدير التحميل تشغيل/إيقاف تشغيله",
  //
  Frontend_FluentCore_SettingsDialog_Title: "الإعدادات",
  Frontend_FluentCore_SettingsDialog_CloseButton_Label: "تم",
  //
  Frontend_FluentCore_BookmarkList_Heading: "العلامات",
  //
  Frontend_FluentCore_DownloadManager_Heading: "التنزيلات",
  Frontend_FluentCore_DownloadManagerTask_StatusQueued_Description: "قائمة الانتظار",
  Frontend_FluentCore_DownloadManagerTask_StatusPaused_Description: "متوقف",
  Frontend_FluentCore_DownloadManagerTask_StatusDownloading_Description: "التحميل",
  Frontend_FluentCore_DownloadManagerTask_StatusProcessing_Description: "المعالجة",
  Frontend_FluentCore_DownloadManagerTask_StatusFailed_Description: "فشل",
  Frontend_FluentCore_DownloadManagerTask_StatusCompleted_Description: "مكتمل",
  Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description: "إزالة هذه المهمة من القائمة",
  //
  Frontend_FluentCore_WebsiteSelect_Description: "حدد موقع ويب من قائمة المواقع المتاحة",
  Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description: "انقر لجلب قائمة بجميع العناوين المتاحة من الموقع،\nاعتماداً على عدد الطلبات المطلوبة قد يستغرق هذا بعض الوقت",
  Frontend_FluentCore_WebsiteSelect_BusyStatus_Description: 'Fetching the list of all available titles,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description: "نجم هذا الموقع (ضع علامة كمفضلة)",
  Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description: "إلغاء نجوم هذا الموقع (إلغاء وضع علامة كمفضلة)",
  Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description: "تعديل إعدادات هذا الموقع",
  Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder: '',
  //
  Frontend_FluentCore_MediaTitleSelect_Description: "حدد عنوان الوسائط من قائمة عناوين الوسائط المتاحة",
  Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description: "انقر لجلب قائمة بجميع الفصول/الحلقات المتاحة من الموقع،\nاعتماداً على عدد الطلبات المطلوبة قد يستغرق هذا بعض الوقت.",
  Frontend_FluentCore_MediaTitleSelect_BusyStatus_Description: 'Fetching the list of all available chapters/episodes,\ndepending on the number of required requests this may take a while',
  Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description: "إضافة هذا العنوان إلى قائمة الإشارات المرجعية",
  Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description: "إزالة هذا العنوان من قائمة الإشارات المرجعية",
  Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description: "اكتشف العنوان من الرابط المنسوخ حاليا في الحافظة",
  Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder: '',
  //
  Frontend_FluentCore_MediaItemList_Heading: "عناصر الوسائط",
  Frontend_FluentCore_MediaItemList_PreviewButton_Description: "عرض المزيد",
  Frontend_FluentCore_MediaItemList_DownloadButton_Description: "تحميل المحتوى",
  //
  Frontend_FluentCore_Preview_CloseButton_Description: "إغلاق المعاينة",
  //
  Frontend_FluentCore_SearchBox_ClearButton_Description: "مسح نمط البحث الحالي",
  Frontend_FluentCore_SearchBox_CaseSenstiveToggleButton_Description: "التبديل بين الوضع الحساس لحالة الحالة والوضع غير الحساس",
  Frontend_FluentCore_SearchBox_CaseRegularExpressionToggleButton_Description: "تبديل بين النص ووضع التعبير العادي",
  // [SECTION]: Engine
  Settings_Global_Frontend: "الواجهة",
  Settings_Global_FrontendInfo: "حدد واجهة المستخدم (إعادة التشغيل مطلوبة)",
  Settings_Global_Language: "اللغة",
  Settings_Global_LanguageInfo: "حدد اللغة لواجهة المستخدم",
  Settings_Global_MediaDirectory: "دليل الوسائط",
  Settings_Global_MediaDirectoryInfo: "حدد الدليل حيث يقوم هاكونيكو بتخزين التنزيلات",
  Settings_Global_MediaDirectory_UnsetError: "لم يتم تحديد دليل التحميل في إعدادات هاكونيكو!",
  Settings_Global_MediaDirectory_PermissionError: "الصلاحية غير كافية للحصول على دليل التحميل!",
  Settings_Global_WebsiteSubDirectory: "استخدام الدلائل الفرعية",
  Settings_Global_WebsiteSubDirectoryInfo: "تعيين HakuNeko يقوم بتخزين الوسائط مباشرة في الدليل، أو استخدام الدلائل الفرعية لكل موقع",
  Settings_Global_MangaExportFormat: 'Manga/Comic Download Format',
  Settings_Global_MangaExportFormatInfo: 'The container format to store the downloaded content for mangas/comics',
  Settings_Global_MangaExportFormat_FolderWithImages: 'Folder with Images',
  Settings_Global_MangaExportFormat_ComicBookArchive: 'Comic Book Archive (*.cbz)',
  Settings_Global_MangaExportFormat_ElectronicPublication: 'E-Book Publication (*.epub)',
  Settings_Global_MangaExportFormat_PortableDocumentFormat: 'Portable Document Format (*.pdf)',
  Settings_Global_DescramblingFormat: "تنسيق فك التشرذم",
  Settings_Global_DescramblingFormatInfo: "حدد تنسيق صورة الإخراج لمواقع الويب التي تستضيف الصور المحيرة (هذا لن ينطبق على الغربيات التي توفر بالفعل صور صالحة)",
  Settings_Global_DescramblingQuality: "إزالة جودة التشرذم",
  Settings_Global_DescramblingQualityInfo: "تعيين الجودة التي سيتم تخزين الصور غير الممزوجة (هذا لن ينطبق على PNG)",
  Settings_Global_Format_PNG: 'PNG (*.png)',
  Settings_Global_Format_JPEG: 'JPEG (*.jpg)',
  Settings_Global_Format_WEBP: 'WEBP (*.webp)',
  Settings_Global_UserAgent: "وكيل المستخدم",
  Settings_Global_UserAgentInfo: "وكيل المستخدم الذي ستتظاهر هاكونيكو بأنه لكل طلب موقع (اتركه فارغاً لاستخدام الافتراضي)",
  Settings_Global_HCaptchaToken: "رمز التحقق H-Captcha",
  Settings_Global_HCaptchaTokenInfo: `تعيين رمز الوصول لتجاوز المواقع تلقائياً التي تستخدم حماية H-Captcha لـ CloudFlare's`,
  Settings_Global_PostCommand: "نشر أمر",
  Settings_Global_PostCommandInfo: '...',
  Settings_NewContent_Check: "تمكين مدقق محتوى جديد",
  Settings_NewContent_CheckInfo: "سيتم التحقق من وجود محتوى جديد للقراءة",
  Settings_NewContent_CheckPeriod: "تحقق من فترة المحتوى الجديدة (بالدقائق)",
  Settings_NewContent_CheckPeriodInfo: "كم دقيقة قبل التحقق مرة أخرى من المحتوى الجديد",
  Settings_NewContent_Notify: "تمكين إشعار سطح المكتب لمحتوى جديد",
  Settings_NewContent_NotifyInfo: "سيتم إرسال إشعار باستخدام نظام إشعارات نظام التشغيل",
  Settings_Global_RPCEnabled: "تمكين RPC",
  Settings_Global_RPCEnabledInfo: "تمكين الوصول إلى الطلبات المعبأة من طرف ثالث على نموذج هاكونيكو (مثلا مساعد هاكونيكو)",
  Settings_Global_RPCPort: "منفذ RPC",
  Settings_Global_RPCPortInfo: "ميناء الاتصالات الذي ستستخدمه الطلبات المتوافقة مع الأطراف الثالثة للتفاعل مع نموذج هاكونيكو هذا (مثل مساعد هاكونيكو)",
  Settings_Global_RPCSecret: "سر RPC",
  Settings_Global_RPCSecretInfo: "عبارة السر المطلوبة من الطلبات المتوافقة مع الطرف الثالث للتفاعل مع نموذج هاكونيكو (مثلا مساعد هاكونيكو)",
  //
  Settings_FeatureFlags_Label: "أعلام الميزة",
  Settings_FeatureFlags_Description: "خيارات متقدمة/تجريبية خاصة لمطوري HakuNeko والمساهمين ومستخدمي الطاقة",
  Settings_FeatureFlags_ShowSplashScreen_Label: "إظهار شاشة البدء",
  Settings_FeatureFlags_ShowSplashScreen_Description: "تبديل شاشة وميض أثناء بدء تشغيل التطبيق / إيقاف تشغيله",
  Settings_FeatureFlags_ShowFetchBrowserWindows_Label: "إظهار ويندوز متصفح FetchBrowser",
  Settings_FeatureFlags_ShowFetchBrowserWindows_Description: "هذا الخيار المركّز للمطور يبدّل رؤية نوافذ المتصفح لجلب البيانات في الخلفية تشغيل/إيقاف",
  Settings_FeatureFlags_CrowdinTranslationMode_Label: "فعّل الترجمات السياقية",
  Settings_FeatureFlags_CrowdinTranslationMode_Description: "هذا الخيار الذي يركز على المساهم يغير وضع التوطين لترجمة كراودين في السياق تشغيل/إيقاف (حساب الراودين + إعادة التشغيل المطلوب)",
  //
  SettingsManager_Settings_AlreadyInitializedError: "حدث خطأ داخلي في التطبيق: يجب تهيئة نطاق الإعدادات <{0}لمرة واحدة فقط!",
  //
  FetchProvider_FetchGraphQL_AggregateError: "فشل الطلب بسبب أخطاء GraphQL التالية:\n{0}",
  FetchProvider_FetchGraphQL_MissingDataError: "فشل الطلب بسبب فقدان بيانات رد GraphQL!",
  FetchProvider_FetchWindow_TimeoutError: "لا يمكن تلبية الطلب في غضون المهلة المحددة!",
  FetchProvider_FetchWindow_CloudFlareError: "فشل الطلب بسبب خطأ CloudFlare التالي: \"{0}\"",
  FetchProvider_FetchWindow_AlertCaptcha: "يرجى حل كلمة التحقق ثم الانتظار حتى يستمر التطبيق (لا تغلق الموقع بعد حل كلمة التحقق)!",
  FetchProvider_Fetch_CloudFlareChallenge: "تم رفض طلب \"{0}\" من قبل الكشف المضاد للبوت لـ CloudFlare.\nتأكد من تجاوز CloudFlare قبل الوصول إلى محتوى هذا الموقع (على سبيل المثال مع امتداد متصفح HakuNeko المساعد).",
  FetchProvider_Fetch_Forbidden: "تم رفض الوصول إلى \"{0}\".\nتأكد من أن الموقع متاح ويمكن الوصول إليه (e. .، VPN لتجاوز قفل المنطقة ، تسجيل الدخول اليدوي عبر رابط الموقع).",
  //
  BookmarkPlugin_ConvertToSerializedBookmark_UnsupportedFormatError: "يبدو أن البيانات المقدمة غير صحيحة/فاسدة ولا يمكن رفعها بنجاح إلى علامة مرجعية!",
  // [SECTION]: Tags
  Tags_Media: "الوسائط",
  Tags_Media_Manga: "مانغا",
  Tags_Media_MangaDescription: "اليابان، الأسود والأبيض، صفحة/صفحة، واحدة/مزدوجة، ...",
  Tags_Media_Manhua: "مانها",
  Tags_Media_ManhuaDescription: "الصين، اللون ، الشريط الطويل، ...",
  Tags_Media_Manhwa: "مانهوا",
  Tags_Media_ManhwaDescription: "كوريا الجنوبية، اللون ، الشريط الطويل، ...",
  Tags_Media_Comic: "فكاهي",
  Tags_Media_ComicDescription: "غربي، ملون، ...",
  Tags_Media_Anime: "أنمي",
  Tags_Media_AnimeDescription: "أنيمي، ...",
  Tags_Media_Cartoon: "كارتون",
  Tags_Media_CartoonDescription: "كارتون، ...",
  Tags_Media_Novel: "مانجا",
  Tags_Media_NovelDescription: "الرواية، ...",
  Tags_Source: "المصدر",
  Tags_Source_Official: "الرسمية",
  Tags_Source_Scanlator: 'Scanlator',
  Tags_Source_Aggregator: "مجمع",
  Tags_Accessibility: "إمكانية الوصول",
  Tags_Accessibility_RegionLock: "قفل المنطقة",
  Tags_Accessibility_RegionLockDescription: "الوصول فقط للبلدان غير المقفلة (Geo-IP)",
  Tags_Accessibility_RateLimit: "حد السرعة",
  Tags_Accessibility_RateLimitDescription: "سرعة التحميل المحدودة، يمكن حظر IP عند تجاوزه",
  Tags_Rating: "التقييم",
  Tags_Rating_Safe: "آمن",
  Tags_Rating_Suggestive: "اقتراح",
  Tags_Rating_Erotica: "الأروتيكا",
  Tags_Rating_Pornographic: "إباحية",
  Tags_Language: "اللغة",
  Tags_Language_Multilingual: "🌐 متعدد اللغات",
  Tags_Language_Arabic: '🇸🇦 Arabic',
  Tags_Language_Chinese: "🇨🇳 صينية",
  Tags_Language_English: "🇬🇧 الإنجليزية",
  Tags_Language_French: "🇫🇷 فرنسية",
  Tags_Language_German: "🇩🇪 الألمانية",
  Tags_Language_Indonesian: '🇮🇩 Indonesian',
  Tags_Language_Italian: "🇮🇹 إيطالية",
  Tags_Language_Japanese: "🇯🇵 يابانية",
  Tags_Language_Korean: '🇰🇷 Korean',
  Tags_Language_Polish: '🇵🇱 Polish',
  Tags_Language_Portuguese: '🇵🇹🇧🇷 Portuguese',
  Tags_Language_Russian: "🇷🇺 الروسية",
  Tags_Language_Spanish: '🇪🇸🇦🇷 Spanish',
  Tags_Language_Thai: '🇹🇭 Thai',
  Tags_Language_Turkish: '🇹🇷 Turkish',
  Tags_Language_Vietnamese: '🇻🇳 Vietnamese',
  Tags_Others: "أخرى",
  // [SECTION]: Annotations
  Annotations_ViewProgress: "التقدم",
  Annotations_ViewProgressDescription: "حالة مخصصة تشير إلى تقدم القراءة/العرض",
  Annotations_ViewProgress_None: '-',
  Annotations_ViewProgress_NoneDescription: "غير مقروء/مشاهدة بعد",
  Annotations_ViewProgress_Viewed: 'x',
  Annotations_ViewProgress_ViewedDescription: "تم قراءة/عرض بالفعل",
  Annotations_ViewProgress_Current: 'o',
  Annotations_ViewProgress_CurrentDescription: "حاليا القراءة/العرض",
  // [SECTION]: Trackers
  Tracker_Kitsu_Settings_Username: "اسم المستخدم",
  Tracker_Kitsu_Settings_UsernameInfo: "اسم المستخدم لتسجيل الدخول التلقائي إلى Kitsu",
  Tracker_Kitsu_Settings_Password: "كلمة المرور",
  Tracker_Kitsu_Settings_PasswordInfo: "كلمة المرور لتسجيل الدخول التلقائي إلى كيتسو",
  // [SECTION]: Plugins (common)
  Plugin_Settings_ThrottlingDownloads: "خنق التنزيلات [ms]",
  Plugin_Settings_ThrottlingDownloadsInfo: '...',
  Plugin_Settings_ThrottlingInteraction: "حد معدل التفاعل [طلبات/دقيقة]",
  Plugin_Settings_ThrottlingInteractionInfo: "الحد من عدد الطلبات على هذا الموقع لمنع حظرها أو حظرها",
  Plugin_Settings_UrlOverride: "تجاوز URL",
  Plugin_Settings_UrlOverrideInfo: "استخدم هذا الرابط كنطاق حالي لهذا الموقع",
  Plugin_Settings_ImageFormat: "تنسيق الصورة المفضلة",
  Plugin_Settings_ImageFormatInfo: "تحميل الصور باستخدام تنسيق هذا الملف إن أمكن",
  Plugin_Common_MangaIndex_NotSupported: "غير قادر على إنشاء فهرس المحتوى لهذا الموقع. استخدم ميزة النسخ والصق للوصول مباشرة إلى محتوى عنوان URL محدد!",
  Plugin_Common_Chapter_UnavailableError: "الفصل غير متوفر (غير مشتري/غير مقفل/عام)!",
  Plugin_Common_Chapter_InvalidError: "فشل في استخراج الصفحات من محتوى الفصل!",
  Plugin_Common_Preferred_Language: "اللغة المفضلة للموقع",
  Plugin_Common_Preferred_LanguageInfo: "اللغة المفضلة لمحتوى الموقع.",
  Plugin_MissingWebsite_UpdateError: "فشل تحديث فهرس المحتوى لموقع غير موجود!",
  Plugin_MissingWebsiteEntry_UpdateError: "فشل تحديث فهرس الوسائط لموقع غير موجود!",
  // [SECTION]: Plugins (specific)
  Plugin_CopyManga_Settings_GlobalCDN: "استخدام CDN العالمية",
  Plugin_CopyManga_Settings_GlobalCDNInfo: "طلب من الشبكة العالمية CDN",
  Plugin_PocketComics_LanguageMismatchError: "غير قادر على العثور على مانغا {0} للغة المحددة {1}",
  Plugin_SheepScanlations_Settings_Username: "اسم المستخدم",
  Plugin_SheepScanlations_Settings_UsernameInfo: "اسم المستخدم لتسجيل الدخول التلقائي للحساب إلى مسح الغيف 😉",
  Plugin_SheepScanlations_Settings_Password: "كلمة المرور",
  Plugin_SheepScanlations_Settings_PasswordInfo: "كلمة المرور لتسجيل الدخول التلقائي للحساب إلى مسح الغيف 😉"
};
export default translations;