<script lang="ts">
    // UI : Carbon
    import 'carbon-components-svelte/css/all.css';
    import './theme/hakuneko.css';
    import './theme/global.css';
    import './theme/sidenav-hack.css';
    import { Content } from 'carbon-components-svelte';
    // Svelte
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    // UI: Components
    import Theme from './components/Theme.svelte';
    import MediaSelect from './components/MediaSelect.svelte';
    import MediaItemSelect from './components/MediaItemSelect.svelte';
    import DownloadsStatus from './components/DownloadManagerStatus.svelte';
    import Viewer from './components/viewer/Viewer.svelte';
    import AppBar from './components/AppBar.svelte';
    import UserMessage from './components/UserMessages.svelte';
    import ContentPage from './components/content-pages/ContentRouter.svelte';
    // UI: Stores
    import { ContentPanel, Theme as ThemeSetting } from './stores/Settings';
    import { selectedItem, contentscreen } from './stores/Stores';

    let resolveFinishLoading: () => void;
    export const FinishLoading = Promise.race([
        new Promise((resolve) => setTimeout(resolve, 7500)),
        new Promise<void>((resolve) => (resolveFinishLoading = resolve)),
    ]);

    onMount(async () => {
        // some delay for pre-rendering
        // Todo: find a way to detect if the UI is loaded
        setTimeout(resolveFinishLoading, 2500);
    });

    let showHome = true;
</script>

<UserMessage />

<Theme theme={$ThemeSetting}>
    <AppBar
        on:home={() => {
            $selectedItem = null;
            $contentscreen = '/';
        }}
    />
    <Content
        id="hakunekoapp"
        class={$ContentPanel ? 'ui-mode-content' : 'ui-mode-download'}
    >
        <MediaSelect />
        <MediaItemSelect />
        {#if $ContentPanel}
            <div id="Content" transition:fade>
                {#if $selectedItem}
                    <Viewer item={$selectedItem} />
                {:else if showHome}
                    <ContentPage />
                {/if}
            </div>
        {/if}
        <div id="Bottom">
            <DownloadsStatus />
        </div>
    </Content>
</Theme>

<style>
    :global(::-webkit-scrollbar) {
        width: 1em; /* Necessary so scrollbar changes from default*/
    }
    :global(::-webkit-scrollbar-track) {
        background: var(--cds-ui-background); /* Background of scrollbar */
    }
    :global(::-webkit-scrollbar-thumb) {
        background: var(--cds-active-ui); /* Scroll marker */
        border-radius: 2em; /* So marker has rounded edges */
    }
    :global(#hakunekoapp) {
        height: calc(100vh - 3.5em);
        max-height: calc(100vh - 3.5em);
        display: grid;
        padding: 0.5em;
        gap: 0.3em 0.3em;
        grid-template-rows: 1fr fit-content(0.5em);
    }
    :global(.ui-mode-content) {
        grid-template-columns: min-content min-content 1fr;
        grid-template-areas:
            'Media Item Content'
            'Bottom Bottom Content';
    }
    :global(.ui-mode-download) {
        grid-template-columns: min-content min-content;
        grid-template-areas:
            'Media Item'
            'Bottom Bottom';
    }

    #Content {
        grid-area: Content;
        overflow-y: auto;
    }
    #Bottom {
        grid-area: Bottom;
    }
    :global(#Header) {
        -webkit-app-region: drag;
    }

    :global(.bx--header__global) {
        -webkit-app-region: drag;
    }

    :global(.bx--header__global > *) {
        -webkit-app-region: no-drag;
    }
    :global(.bx--modal-container) {
        -webkit-app-region: no-drag;
    }
</style>
