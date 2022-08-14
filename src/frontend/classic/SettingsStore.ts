import { type Readable, readable, writable } from 'svelte/store';
import { type ILocale, VariantResourceKey as R } from '../../i18n/ILocale';
import { GetLocale } from '../../i18n/Localization';
import { Check, Choice, type IValue, type Setting } from '../../engine/SettingsManager';
import { Key as GlobalKey } from '../../engine/SettingsGlobal';

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
    await settings.Initialize(Theme, ContentPanel, ViewerMode, ViewerReverseDirection, ViewerDoublePage);
    HakuNeko.SettingsManager.OpenScope().Get<Choice>(GlobalKey.Language).ValueChanged.Subscribe(() => Locale.set(GetLocale()));
}

/**
 * Create a readable svelte store that is coupled with the given setting
 * and updated whenever the value of the underlying setting is changed.
 */
function CreateStore<T extends IValue>(setting: Setting<T>): Readable<T> {
    return readable<T>(setting.Default, set => {
        set(setting.Value); // => don't forget to assign current setting value to store
        const callback = (_: typeof setting, value: T) => set(value);
        setting.ValueChanged.Subscribe(callback);
        return () => setting.ValueChanged.Unsubscribe(callback);
    });
}

export const Locale = writable<ILocale>(GetLocale());

export const Theme = new Choice(
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
);
export const ThemeValue = CreateStore(Theme);

export const ContentPanel = new Check(
    Key.ContentPanel,
    R.Frontend_Classic_Settings_ContentPanel,
    R.Frontend_Classic_Settings_ContentPanelInfo,
    true
);
export const ContentPanelValue = CreateStore(ContentPanel);
export const FuzzySearch = new Check(
    Key.FuzzySearch,
    R.Frontend_Classic_Settings_FuzzySearch,
    R.Frontend_Classic_Settings_FuzzySearchInfo,
    true
);
export const FuzzySearchValue = CreateStore(FuzzySearch);

export const ViewerMode = new Choice(
    Key.ViewerMode,
    R.Frontend_Classic_Settings_ViewerMode,
    R.Frontend_Classic_Settings_ViewerModeInfo,
    Key.ViewerMode_Paginated,
    { key: Key.ViewerMode_Paginated, label: R.Frontend_Classic_Settings_ViewerMode_Paginated },
    { key: Key.ViewerMode_Longstrip, label: R.Frontend_Classic_Settings_ViewerMode_Longstrip },
);
export const ViewerModeValue = CreateStore(ViewerMode);

export const ViewerReverseDirection = new Check(
    Key.ViewerReverseDirection,
    R.Frontend_Classic_Settings_ViewerReverseDirection,
    R.Frontend_Classic_Settings_ViewerReverseDirectionInfo,
    false
);
export const ViewerReverseDirectionValue = CreateStore(ViewerReverseDirection);

export const ViewerDoublePage = new Check(
    Key.ViewerDoublePage,
    R.Frontend_Classic_Settings_ViewerDoublePage,
    R.Frontend_Classic_Settings_ViewerDoublePageInfo,
    false
);
export const ViewerDoublePageValue = CreateStore(ViewerDoublePage);