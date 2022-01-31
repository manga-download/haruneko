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
    import { WindowController } from '../Stores';
    import SettingsPanel from './settings/SettingsPanel.svelte';
    import { Locale } from '../SettingsStore';

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
</script>

<Header
    id="Header"
    expandedByDefault={false}
    persistentHamburgerMenu={true}
    company={$Locale.Frontend_Product_Title()}
    platformName={$Locale.Frontend_Product_Description()}
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
            <!-- Show global HakuNeko settings?
            <SettingsViewer scope={Scope} />
            -->
            <SettingsPanel />
        </HeaderAction>
    </HeaderUtilities>
</Header>

<MenuLeftPanel {isSideNavOpen} />
