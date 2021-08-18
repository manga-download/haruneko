<script lang="ts">
    import "carbon-components-svelte/css/all.css";
    import "./theme/hakuneko.css";
    import "./theme/sidenav-hack.css";

    import { Content, Tabs, Tab, TabContent } from "carbon-components-svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import Theme from "./components/Theme.svelte";
    import MediaSelect from "./components/MediaSelect.svelte";
    import MediaItemSelect from "./components/MediaItemSelect.svelte";
    import Jobs from "./components/Jobs.svelte";
    import Console from "./components/Console.svelte";
    import Network from "./components/Network.svelte";
    import Home from "./components/Home.svelte";
    import Viewer from "./components/Viewer.svelte";
    import AppBar from "./components/AppBar.svelte";
    import type { IMediaContainer } from "../../engine/providers/MediaPlugin";
    import {
        getSettingDefaultValue,
        storageKeys,
        castBooleanSetting,
    } from "./utils/storage";
    let resolveFinishLoading: (value: void | PromiseLike<void>) => void;
    export const FinishLoading = new Promise<void>(
        (resolve) => (resolveFinishLoading = resolve)
    );

    // Window controls
    let win = nw.Window.get();

    win.on("maximize", () => {
        winMaximized = true;
    });
    win.on("restore", () => {
        winMaximized = false;
    });
    let winMaximized =
        win.x <= 0 &&
        win.y <= 0 &&
        win.width >= screen.availWidth &&
        win.height >= screen.availHeight;

    // UI
    let isSideNavOpen = false;
    let isOpen = false;
    let theme: string;

    let uimode = castBooleanSetting(
        getSettingDefaultValue(storageKeys.SHOW_CONTENT_PANEL, true)
    )
        ? "ui-mode-content"
        : "ui-mode-download";

    let app: HTMLElement;
    onMount(async () => {
        app = document.getElementById("hakunekoapp")!;
        app.classList.add(uimode);
        // some delay for pre-rendering
        setTimeout(resolveFinishLoading, 2500);
    });

    function changeUIMode() {
        app.classList.remove(uimode);
        uimode =
            uimode === "ui-mode-content"
                ? "ui-mode-download"
                : "ui-mode-content";
        app.classList.add(uimode);
    }

    function changeTheme(themeId: string) {
        theme = themeId;
    }

    let selectedMedia: IMediaContainer | undefined;
    let selectedItem: IMediaContainer | undefined;
    let selectedBottomTab = 0;
    let currentContent = "home";
    let showHome = true;

    $: currentContent = selectedItem ? "viewer" : "home";
</script>

<Theme persist bind:theme>
    <AppBar
        {isSideNavOpen}
        {isOpen}
        {winMaximized}
        {changeUIMode}
        {changeTheme}
    />

    <Content id="hakunekoapp">
        <MediaSelect on:select={(e) => (selectedMedia = e.detail)} />
        <MediaItemSelect
            media={selectedMedia}
            on:view={(e) => (selectedItem = e.detail)}
        />
        {#if uimode === "ui-mode-content"}
            <div id="Content" transition:fade>
                {#if currentContent === "home" && showHome}
                    <Home />
                {:else if currentContent === "viewer"}
                    <Viewer item={selectedItem} />
                {/if}
            </div>
        {/if}
        <div id="Bottom" transition:fade>
            <Tabs type="container" bind:selected={selectedBottomTab}>
                <Tab
                    label="X"
                    style="width:3em;"
                    disabled={selectedBottomTab === 0}
                />
                <Tab label="Jobs" />
                <Tab label="Console" />
                <Tab label="Network" />
                <div
                    id="BottomTabs"
                    slot="content"
                    class:open={selectedBottomTab !== 0}
                >
                    <TabContent tabindex={0} style="padding:0;"
                        ><div class="tabcontent" /></TabContent
                    >
                    <TabContent tabindex={1} style="padding:0;"
                        ><div class="tabcontent"><Jobs /></div></TabContent
                    >
                    <TabContent tabindex={2} style="padding:0;"
                        ><div class="tabcontent"><Console /></div></TabContent
                    >
                    <TabContent tabindex={3} style="padding:0;"
                        ><div class="tabcontent"><Network /></div></TabContent
                    >
                </div>
            </Tabs>
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
    :global(#app) {
        background: var(--cds-ui-background);
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
            "Media Item Content"
            "Bottom Bottom Content";
    }
    :global(.ui-mode-download) {
        grid-template-columns: minmax(20em, 1fr) minmax(20em, 1fr);
        grid-template-areas:
            "Media Item"
            "Bottom Bottom";
    }

    #Content {
        grid-area: Content;
    }
    #Bottom {
        grid-area: Bottom;
        border-top: 1px groove var(--cds-button-separator);
    }
    #BottomTabs {
        max-height: 0;
        transition: max-height 0.5s;
    }
    #BottomTabs.open {
        max-height: 10em;
    }

    .tabcontent {
        height: 10em;
        padding: 0.2em;
        background-color: var(--cds-field-01);
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
</style>
