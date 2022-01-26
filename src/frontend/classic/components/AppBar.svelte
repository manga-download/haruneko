<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        SkipToContent,
    } from 'carbon-components-svelte';
    import MinimizeIcon from 'carbon-icons-svelte/lib/Subtract24';
    import MaximizeIcon from 'carbon-icons-svelte/lib/Checkbox16';
    import RestoreIcon from 'carbon-icons-svelte/lib/Copy16';
    import CloseIcon from 'carbon-icons-svelte/lib/Close24';
    import MenuLeftPanel from './MenuLeftPanel.svelte';
    import { themes } from './Theme.svelte';
    import SettingItem from './settings/SettingItem.svelte';
    import SettingSelect from './settings/SettingSelect.svelte';
    import SettingToggle from './settings/SettingToggle.svelte';
    import {
        settings,
        theme,
        showContentPanel,
        viewerMode,
        inversedReading,
        doublePage,
    } from '../utils/storage';
    import { viewerModesSelect } from '../utils/viewerMode';
    import { WindowController } from '../Stores';
    import { L, CurrentLocale } from '../../../i18n/Localization';
    import LanguageSelect from './settings/LanguageSelect.svelte';

    export let isSideNavOpen: boolean;
    export let isOpen: boolean;
    let winMaximized = false;

    function updateWindowState() {
        winMaximized =
            window.outerWidth >= screen.availWidth &&
            window.outerHeight >= screen.availHeight &&
            window.screenTop <= screen['availTop'] &&
            window.screenLeft <= screen['availLeft'];
    }
    updateWindowState();

    window.addEventListener('resize', updateWindowState);

    let minimize: () => void;
    let maximize: () => void;
    let restore: () => void;
    let close: () => void;

    $: if ($WindowController) {
        minimize = $WindowController.Minimize.bind($WindowController);
        maximize = $WindowController.Maximize.bind($WindowController);
        restore = $WindowController.Restore.bind($WindowController);
        close = $WindowController.Close.bind($WindowController);
    }

    // NOTE: Sample for reactive localization, which reflects instantly without reloading the frontend
    let locale = CurrentLocale();
    HakuNeko.EventManager.LocaleChanged.Subscribe((_, code) => (locale = code));
</script>

<Header
    id="Header"
    expandedByDefault={false}
    persistentHamburgerMenu={true}
    company={L(locale).Frontend_Product_Title()}
    platformName={L(locale).Frontend_Product_Description()}
    bind:isSideNavOpen
>
    <div slot="skip-to-content">
        <SkipToContent />
    </div>
    <HeaderUtilities>
        <HeaderGlobalAction
            on:click={minimize}
            aria-label="Minimize"
            icon={MinimizeIcon}
        />
        <HeaderGlobalAction
            on:click={() => (winMaximized ? restore() : maximize())}
            aria-label="Maximize"
            icon={winMaximized ? RestoreIcon : MaximizeIcon}
        />
        <HeaderGlobalAction
            on:click={() => close()}
            aria-label="Close"
            icon={CloseIcon}
        />
        <HeaderAction bind:isOpen>
            <LanguageSelect />
            <SettingItem
                labelText="Show content panel"
                helperText="Display or not the hakuneko tutorial"
            >
                <SettingToggle
                    store={showContentPanel}
                    storageKey={settings.SHOW_CONTENT_PANEL.KEY}
                />
            </SettingItem>
            <SettingItem
                labelText="Themes"
                helperText="You can select the theme of the hakuneko app"
            >
                <SettingSelect
                    store={theme}
                    storageKey={settings.THEME.KEY}
                    items={themes}
                />
            </SettingItem>
            <SettingItem
                labelText="Viewer mode"
                helperText="You can change the viewer mode (webtoon or manga)"
            >
                <SettingSelect
                    store={viewerMode}
                    storageKey={settings.VIEWER_MODE.KEY}
                    items={viewerModesSelect}
                />
            </SettingItem>
            {#if $viewerMode === 'manga'}
                <SettingItem
                    labelText="Inverse reading"
                    helperText="Inverse the reading (like a real manga)"
                >
                    <SettingToggle
                        store={inversedReading}
                        storageKey={settings.INVERSED_READING.KEY}
                    />
                </SettingItem>
                <SettingItem
                    labelText="Double page"
                    helperText="Display two page at a time (like a real manga)"
                >
                    <SettingToggle
                        store={doublePage}
                        storageKey={settings.DOUBLE_PAGE.KEY}
                    />
                </SettingItem>
            {/if}
        </HeaderAction>
    </HeaderUtilities>
</Header>

<MenuLeftPanel {isSideNavOpen} />
