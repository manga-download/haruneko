
import {LocaleID, FrontendResourceKey as R } from '../../../i18n/ILocale';
import { Check, Choice, Numeric} from '../../../engine/SettingsManager';
import { LoadSettingStore, SettingCountStore, SettingPersistantStore } from './storesHelpers.svelte';
import { Key as GlobalKey, Scope as GlobalScope } from '../../../engine/SettingsGlobal';
import { GetLocale } from '../../../i18n/Localization';

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
    ViewerReverseDirection = 'viewer-reverse-direction',
    //
    ViewerDoublePage = 'viewer-double-page',
    //
    StartupGuideEnabled = 'startup-guide-enabled',
}

const FrontendClasicScope = 'frontend.classic';
const FrontendClasicScope_Viewer = 'frontend.classic.viewer';

export const globalScopeSettings = HakuNeko.SettingsManager.OpenScope(GlobalScope);
export const frontendClassicSettings = HakuNeko.SettingsManager.OpenScope(FrontendClasicScope);
export const frontendClassicSettingsViewer = HakuNeko.SettingsManager.OpenScope(FrontendClasicScope_Viewer);

export async function Initialize(): Promise<void> {
    
    await frontendClassicSettings.Initialize(
        Settings.Theme.setting,
        Settings.ContentPanel.setting,
        Settings.SidenavTrail.setting,
        Settings.SidenavIconsOnTop.setting,
        Settings.FuzzySearch.setting,
    );

    await frontendClassicSettingsViewer.Initialize(
        Settings.ViewerMode.setting,
        Settings.ViewerReverseDirection.setting,
        Settings.ViewerDoublePage.setting,
    );
}

class UIClassicStore {
    Theme= new SettingPersistantStore<string, Choice>(new Choice(
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

    ContentPanel = new SettingPersistantStore<boolean, Check>(new Check(
        Key.ContentPanel,
        R.Frontend_Classic_Settings_ContentPanel,
        R.Frontend_Classic_Settings_ContentPanelInfo,
        true
    ));

    SidenavTrail = new SettingPersistantStore<boolean, Check>(new Check(
        Key.SidenavTrail,
        R.Frontend_Classic_Settings_SidenavTrail,
        R.Frontend_Classic_Settings_SidenavTrailInfo,
        true
    ));

    SidenavIconsOnTop = new SettingPersistantStore<boolean, Check>(new Check(
        Key.SidenavIconsOnTop,
        R.Frontend_Classic_Settings_SidenavIconsOnTop,
        R.Frontend_Classic_Settings_SidenavIconsOnTopInfo,
        false
    ));

    FuzzySearch= new SettingPersistantStore<boolean, Check>(new Check(
        Key.FuzzySearch,
        R.Frontend_Classic_Settings_FuzzySearch,
        R.Frontend_Classic_Settings_FuzzySearchInfo,
        false
    ));

    ViewerMode = new SettingPersistantStore<string, Choice>(new Choice(
        Key.ViewerMode,
        R.Frontend_Classic_Settings_ViewerMode,
        R.Frontend_Classic_Settings_ViewerModeInfo,
        Key.ViewerMode_Paginated,
        { key: Key.ViewerMode_Paginated, label: R.Frontend_Classic_Settings_ViewerMode_Paginated },
        { key: Key.ViewerMode_Longstrip, label: R.Frontend_Classic_Settings_ViewerMode_Longstrip },
    ));

    ViewerReverseDirection = new SettingPersistantStore<boolean, Check>( new Check(
        Key.ViewerReverseDirection,
        R.Frontend_Classic_Settings_ViewerReverseDirection,
        R.Frontend_Classic_Settings_ViewerReverseDirectionInfo,
        false
    ));

    ViewerDoublePage = new SettingPersistantStore<boolean, Check>(new Check(
        Key.ViewerDoublePage,
        R.Frontend_Classic_Settings_ViewerDoublePage,
        R.Frontend_Classic_Settings_ViewerDoublePageInfo,
        false
    ));

    checkNewContent = LoadSettingStore<boolean, Check>(globalScopeSettings, GlobalKey.CheckNewContent);


    // Non persistant settings
    /** Viewer **/

    ViewerZoom = new SettingCountStore(new Numeric(
        null,
        R.Frontend_Classic_Settings_ViewerZoom,
        R.Frontend_Classic_Settings_ViewerZoomInfo,
        0,-100,100),
        10
    );


    ViewerZoomRatio = $derived((100 + this.ViewerZoom.value) / 100);
    ViewerPadding = new SettingCountStore(new Numeric(
        null,
        R.Frontend_Classic_Settings_ViewerPadding,
        R.Frontend_Classic_Settings_ViewerPaddingInfo,
        2,0,Infinity),
        0.5
    );
}
export const Settings = new UIClassicStore();

class GlobalStore {
    _Locale = LoadSettingStore<string, Choice>(globalScopeSettings,GlobalKey.Language);
    Locale = $derived(GetLocale(this._Locale.value as LocaleID));
}
export const GlobalSettings = new GlobalStore();