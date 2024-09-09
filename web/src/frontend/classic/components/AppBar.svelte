<script lang="ts">
    import {
        Button,
        Header,
        HeaderUtilities,
        HeaderGlobalAction,
        SkipToContent,
    } from 'carbon-components-svelte';
    import {
        Bookmark,
        Checkbox,
        Close,
        Copy,
        Home,
        Subtract,
    } from 'carbon-icons-svelte';
    import Sidenav from './Sidenav.svelte';

    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
        WindowController,
    } from '../stores/Stores';
    import { Locale, SidenavIconsOnTop } from '../stores/Settings';

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
    let minimize: () => void = $state();
    let maximize: () => void = $state();
    let restore: () => void = $state();
    let close: () => void = $state();

    WindowController.subscribe((controller) => {
        if (controller) {
            showWindowControls = controller.HasControls;
            minimize = controller.Minimize.bind(controller);
            maximize = controller.Maximize.bind(controller);
            restore = controller.Restore.bind(controller);
            close = controller.Close.bind(controller);
        }
    });
</script>

<Header
    id="Header"
    expandedByDefault={false}
    persistentHamburgerMenu={true}
    bind:isSideNavOpen
>
    <div slot="platform">
        {#if $SidenavIconsOnTop}
            <Button
                class="clickable"
                icon={Home}
                iconDescription={$Locale.Frontend_Classic_Sidenav_Home()}
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
                    $selectedPlugin = window.HakuNeko.BookmarkPlugin;
                    $selectedMedia = undefined;
                    $selectedItem = undefined;
                }}
            />
        {/if}
        <div id="AppTitle" class:padding-left={$SidenavIconsOnTop}>
            {$Locale.Frontend_Product_Title()}
            <span class="appdesc">{$Locale.Frontend_Product_Description()}</span
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
    :global(#Header) {
        padding-left: 0;
    }
    div[slot='platform'] :global(.clickable) {
        -webkit-app-region: no-drag;
    }
    div[slot='platform'] :global(button) {
        padding-right: 0.2em;
        padding-left: 0.2em;
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
