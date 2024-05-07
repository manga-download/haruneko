import { writable, derived } from 'svelte/store';
import { type ILocale, FrontendResourceKey as R } from '../../../i18n/ILocale';
import { GetLocale } from '../../../i18n/Localization';
import { Check, Choice} from '../../../engine/SettingsManager';
import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
import { CreateCountStore, CreateSettingStore, CreateExistingSettingStore } from './storesHelpers';

const scope = 'frontend.classic';

/**
 * Pre-defined identifiers which are used as values for persistant storage,
 * or may be used in conditional statements.
 * Changing these may cause migration issues with older values previously stored in persistant storage.
 */
export const enum Key {
    //
    Theme = 'theme',
    Theme_HakuNeko = 'hakuneko',
    Theme_White = 'white',
    Theme_Gray10 = 'g10',
    Theme_Gray90 = 'g90',
    Theme_Gray100 = 'g100',
    Theme_SheepyNeko = 'sheepyneko',
    //
    ContentPanel = 'content-panel',
    SidenavTrail = 'sidenav-trail',
    SidenavIconsOnTop = 'sidenav-icons-on-top',
    //
    FuzzySearch ='fuzzy-search',
    //
    ViewerMode = 'viewer-mode',
    ViewerMode_Paginated = 'paginated',
    ViewerMode_Longstrip = 'longstrip',
    //
    ViewerReverseDirection = 'viewer-reverse-direction',
    //
    ViewerDoublePage = 'viewer-double-page',
}

export async function Initialize(): Promise<void> {
    const settings = HakuNeko.SettingsManager.OpenScope(scope);
    await settings.Initialize(Theme.setting, ContentPanel.setting, ViewerMode.setting, ViewerReverseDirection.setting, ViewerDoublePage.setting);
    HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).Subscribe(() => Locale.set(GetLocale()));
}

// Available Settings

export const Locale = writable<ILocale>(GetLocale());

export const Theme= CreateSettingStore<string, Choice>(new Choice(
    Key.Theme,
    R.Frontend_Classic_Settings_Theme,
    R.Frontend_Classic_Settings_ThemeInfo,
    Key.Theme_HakuNeko,
    { key: Key.Theme_HakuNeko, label: R.Frontend_Classic_Settings_Theme_HakuNeko },
    { key: Key.Theme_White, label: R.Frontend_Classic_Settings_Theme_CarbonWhite },
    { key: Key.Theme_Gray10, label: R.Frontend_Classic_Settings_Theme_CarbonG10 },
    { key: Key.Theme_Gray90, label: R.Frontend_Classic_Settings_Theme_CarbonG90 },
    { key: Key.Theme_Gray100, label: R.Frontend_Classic_Settings_Theme_CarbonG100 },
    { key: Key.Theme_SheepyNeko, label: R.Frontend_Classic_Settings_Theme_SheepyNeko },
));

export const ContentPanel = CreateSettingStore<boolean, Check>(new Check(
    Key.ContentPanel,
    R.Frontend_Classic_Settings_ContentPanel,
    R.Frontend_Classic_Settings_ContentPanelInfo,
    true
));

export const SidenavTrail = CreateSettingStore<boolean, Check>(new Check(
    Key.SidenavTrail,
    R.Frontend_Classic_Settings_SidenavTrail,
    R.Frontend_Classic_Settings_SidenavTrailInfo,
    true
));

export const SidenavIconsOnTop = CreateSettingStore<boolean, Check>(new Check(
    Key.SidenavIconsOnTop,
    R.Frontend_Classic_Settings_SidenavIconsOnTop,
    R.Frontend_Classic_Settings_SidenavIconsOnTopInfo,
    false
));

export const FuzzySearch= CreateSettingStore<boolean, Check>(new Check(
    Key.FuzzySearch,
    R.Frontend_Classic_Settings_FuzzySearch,
    R.Frontend_Classic_Settings_FuzzySearchInfo,
    true
));

export const ViewerMode = CreateSettingStore<string, Choice>(new Choice(
    Key.ViewerMode,
    R.Frontend_Classic_Settings_ViewerMode,
    R.Frontend_Classic_Settings_ViewerModeInfo,
    Key.ViewerMode_Paginated,
    { key: Key.ViewerMode_Paginated, label: R.Frontend_Classic_Settings_ViewerMode_Paginated },
    { key: Key.ViewerMode_Longstrip, label: R.Frontend_Classic_Settings_ViewerMode_Longstrip },
));

export const ViewerReverseDirection = CreateSettingStore<boolean, Check>( new Check(
    Key.ViewerReverseDirection,
    R.Frontend_Classic_Settings_ViewerReverseDirection,
    R.Frontend_Classic_Settings_ViewerReverseDirectionInfo,
    false
));

export const ViewerDoublePage = CreateSettingStore<boolean, Check>(new Check(
    Key.ViewerDoublePage,
    R.Frontend_Classic_Settings_ViewerDoublePage,
    R.Frontend_Classic_Settings_ViewerDoublePageInfo,
    false
));

export const checkNewContent = CreateExistingSettingStore<boolean, Check>(GlobalKey.CheckNewContent);

// Non persistant settings
/** Viewer **/

export const ViewerZoom = CreateCountStore(0, 10, -100, 100);
export const ViewerZoomRatio = derived(
    ViewerZoom,
    $ViewerZoom => (100 + $ViewerZoom) / 100
);
export const ViewerPadding = CreateCountStore(2, 0.5, 0);