<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        SkipToContent,
    } from 'carbon-components-svelte';
    import { Checkbox, Close, Copy, Subtract } from 'carbon-icons-svelte';
    import MenuLeftPanel from './MenuLeftPanel.svelte';
    import { WindowController } from '../stores/Stores';
    import SettingsPanel from './settings/SettingsPanel.svelte';
    import { Locale } from '../stores/Settings';

    let isSideNavOpen: boolean = false;

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

    let showWindowControls = false;
    let minimize: () => void;
    let maximize: () => void;
    let restore: () => void;
    let close: () => void;

    $: if ($WindowController) {
        showWindowControls = $WindowController.HasControls;
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
        {#if showWindowControls}
            <HeaderGlobalAction
                on:click={minimize}
                aria-label="Minimize"
                icon={Subtract}
            />
            <HeaderGlobalAction
                on:click={() => (winMaximized ? restore() : maximize())}
                aria-label="Maximize"
                icon={winMaximized ? Copy : Checkbox}
            />
            <HeaderGlobalAction
                on:click={() => close()}
                aria-label="Close"
                icon={Close}
            />
        {/if}
        <HeaderAction>
            <!-- Show global HakuNeko settings?
            <SettingsViewer scope={Scope} />
            -->
            <SettingsPanel />
        </HeaderAction>
    </HeaderUtilities>
</Header>

<MenuLeftPanel bind:isOpen={isSideNavOpen} on:home />
