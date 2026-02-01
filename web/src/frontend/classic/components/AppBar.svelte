<script lang="ts">
    import {
        Button,
        Header,
        HeaderUtilities,
        HeaderGlobalAction,
        SkipToContent,
    } from 'carbon-components-svelte';
    import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
    import Checkbox from 'carbon-icons-svelte/lib/Checkbox.svelte';
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
    import Home from 'carbon-icons-svelte/lib/Home.svelte';
    import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';
    import Sidenav from './Sidenav.svelte';

    import  {Store as UI } from '../stores/Stores.svelte';
    import { GlobalSettings, Settings } from '../stores/Settings.svelte';

    interface Props {
        onHome?: () => void;
    };
    let { onHome }: Props  = $props();

    let isSideNavOpen: boolean = $state(false);

    let winMaximized = $state(false);

    function updateWindowState() {
        winMaximized =
            window.outerWidth >= screen.availWidth &&
            window.outerHeight >= screen.availHeight &&
            window.screenTop <= screen['availTop'] &&
            window.screenLeft <= screen['availLeft'];
    }
    updateWindowState();

    window.addEventListener('resize', updateWindowState);

    let showWindowControls = $state(false);
    let minimize = $derived(UI.WindowController?.Minimize.bind(UI.WindowController));
    let maximize = $derived(UI.WindowController?.Maximize.bind(UI.WindowController));
    let restore = $derived(UI.WindowController?.Restore.bind(UI.WindowController));
    let close = $derived(UI.WindowController?.Close.bind(UI.WindowController));

</script>

<Header
    id="Header"
    expandedByDefault={false}
    persistentHamburgerMenu
    bind:isSideNavOpen
>
    <div slot="platform">
        {#if Settings.SidenavIconsOnTop.value}
            <Button
                class="clickable"
                icon={Home}
                iconDescription={GlobalSettings.Locale.Frontend_Classic_Sidenav_Home()}
                kind="ghost"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                on:click={onHome}
            />
            <Button
                class="clickable"
                icon={Bookmark}
                iconDescription={'Bookmarks'}
                kind="ghost"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                on:click={() => {
                    UI.selectedPlugin = window.HakuNeko.BookmarkPlugin;
                    UI.selectedMedia = undefined;
                    UI.selectedItem = undefined;
                }}
            />
        {/if}
        <div id="AppTitle" class:padding-left={Settings.SidenavIconsOnTop.value}>
            {GlobalSettings.Locale.Frontend_Product_Title()}
            <span class="appdesc">{GlobalSettings.Locale.Frontend_Product_Description()}</span
            >
        </div>
    </div>

    <div slot="skip-to-content">
        <SkipToContent />
    </div>
    <HeaderUtilities>
        {#if showWindowControls}
            <HeaderGlobalAction
                on:click={minimize}
                iconDescription="Minimize"
                icon={Subtract}
            />
            <HeaderGlobalAction
                on:click={() => (winMaximized ? restore() : maximize())}
                iconDescription="Maximize"
                icon={winMaximized ? Copy : Checkbox}
            />
            <HeaderGlobalAction
                on:click={() => close()}
                iconDescription="Close"
                icon={Close}
                class="close"
            />
        {/if}
    </HeaderUtilities>
</Header>

<Sidenav bind:isOpen={isSideNavOpen} {onHome} />

<style>
    div[slot='platform'] :global(.clickable) {
        -webkit-app-region: no-drag;
    }
    div[slot='platform'] :global(button) {
        padding-right: 0.2em;
        padding-left: 0.2em;
    }
    #AppTitle {
        -webkit-app-region: drag;
    }
    #AppTitle:global(.padding-left) {
        padding-left: 1em;
    }
    #AppTitle .appdesc {
        font-weight: var(--cds-body-short-01-font-weight, 400);
        padding-left: 1em;
    }
    div[slot='platform'] {
        display: flex;
        align-items: center;
    }

    :global(.bx--header__global .bx--header__action.close):hover {
        background-color: var(--cds-button-danger-primary);
    }
</style>
