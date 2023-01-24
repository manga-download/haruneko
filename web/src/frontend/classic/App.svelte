<script lang="ts">
    // UI : Carbon
    import 'carbon-components-svelte/css/all.css';
    import './theme/hakuneko.css';
    import './theme/global.css';
    import './theme/sidenav-hack.css';
    import {
        Content,
        Accordion,
        AccordionItem,
    } from 'carbon-components-svelte';
    // Svelte
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    // UI: Components
    import Theme from './components/Theme.svelte';
    import MediaSelect from './components/MediaSelect.svelte';
    import MediaItemSelect from './components/MediaItemSelect.svelte';
    import Jobs from './components/Jobs.svelte';
    import Console from './components/Console.svelte';
    import Network from './components/Network.svelte';
    import Viewer from './components/viewer/Viewer.svelte';
    import AppBar from './components/AppBar.svelte';
    import UserMessage from './components/UserMessages.svelte';
    import ContentPage from './components/content-pages/ContentRouter.svelte';
    // UI: Stores
    import { ContentPanelValue, ThemeValue } from './stores/Settings';
    import { selectedItem } from './stores/Stores';

    let resolveFinishLoading: (value: void | PromiseLike<void>) => void;
    export const FinishLoading = new Promise<void>(
        (resolve) => (resolveFinishLoading = resolve)
    );

    let app: HTMLElement;

    onMount(async () => {
        app = document.getElementById('hakunekoapp')!;
        app.classList.add(uimode);
        // some delay for pre-rendering
        // Todo: find a way to detect if the UI is loaded
        setTimeout(resolveFinishLoading, 2500);
    });

    let selectedBottomTab = 0;
    let currentContent = 'home';
    let showHome = true;

    $: uimode = $ContentPanelValue ? 'ui-mode-content' : 'ui-mode-download';

    $: if (app) {
        const oldUimode =
            uimode === 'ui-mode-content'
                ? 'ui-mode-download'
                : 'ui-mode-content';
        app.classList.remove(oldUimode);
        app.classList.add(uimode);
    }

    $: currentContent = $selectedItem ? 'viewer' : 'home';
</script>

<UserMessage />

<Theme theme={$ThemeValue}>
    <AppBar on:home={() => ($selectedItem = null)} />
    <Content id="hakunekoapp">
        <MediaSelect />
        <MediaItemSelect />
        {#if uimode === 'ui-mode-content'}
            <div id="Content" transition:fade>
                {#if currentContent === 'viewer'}
                    <Viewer item={$selectedItem} />
                {:else if currentContent && showHome}
                    <ContentPage />
                {/if}
            </div>
        {/if}
        <div id="Bottom" transition:fade>
            <Accordion>
                <AccordionItem title="Jobs">
                    <Jobs />
                </AccordionItem>
            </Accordion>
        </div>
    </Content>
</Theme>

<style>
    @font-face {
        font-family: 'BabelStoneFlags';
        src: url('/BabelStoneFlags.woff2') format('woff');
        font-style: normal;
    }
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
        grid-template-columns: 19em 19em 1fr;
        grid-template-areas:
            'Media Item Content'
            'Bottom Bottom Content';
    }
    :global(.ui-mode-download) {
        grid-template-columns: minmax(20em, 1fr) minmax(20em, 1fr);
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
        max-height: 20em;
    }

    :global(#BottomTabs .bx--tab--content) {
        padding: 0;
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
