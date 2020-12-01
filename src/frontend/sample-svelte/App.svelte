<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderSearch,
        HeaderGlobalAction,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavMenuItem,
        SideNavLink,
        SkipToContent,
        Content,
        Accordion, AccordionItem,
        InlineLoading,
        SkeletonPlaceholder,
    } from "carbon-components-svelte";
    import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";

    import { onMount } from 'svelte';

    import Theme from "./components/Theme.svelte";
    import MangaSelect from "./components/MangaSelect.svelte";
    import ChapterSelect from "./components/ChapterSelect.svelte";

    import { fly,fade } from 'svelte/transition';

    import type {IMangaHost,IManga, IChapter } from '../../engine/MangaProvider';

    let isSideNavOpen = false;
    let isOpen = false;

    let theme = "g90";
    let uimode = 'ui-mode-content' // content, download;
    let app: HTMLElement;

    onMount(async () => {
        app = document.getElementById("hakunekoapp")!;
        app.classList.add(uimode);
    });

    function changeUIMode() {
        app.classList.remove(uimode);
        uimode = (uimode === 'ui-mode-content' ? 'ui-mode-download' : 'ui-mode-content');
        app.classList.add(uimode);
    }

    let selectedPlugin: IMangaHost | null;
    let selectedManga: IManga| null;
    let selectedChapter: IChapter| null;

</script>
<style>
    :global(#hakuneko) {
        position: fixed; 
        overflow:hidden;
        width: 100%;
        height: 100%;
    }

    :global(#hakunekoapp)  { 
        height: calc(100vh - 3.5em);
        max-height: calc(100vh - 3.5em);
        display: grid;
        padding:0.5em; 
        gap: 0.3em 1em;
        grid-template-rows: 1fr fit-content(0.5em);
    }
    :global(.ui-mode-content)  { 
        grid-template-columns: 20em 20em 1fr;
        grid-template-areas:
            "Manga Chapter Content"
            "Bottom Bottom Content";
    }
    :global(.ui-mode-download) {
        grid-template-columns: minmax(20em,1fr) minmax(20em,1fr);
        grid-template-areas:
            "Manga Chapter"
            "Bottom Bottom";
    }

    .Content { grid-area: Content; }
    .Bottom {
        grid-area: Bottom;
        border-top: var(--manga-control-separator);
    }

    :global(.list) {
        border: var(--manga-list-border);
        background-color: var(--manga-list-background-color);
        overflow-y: scroll;
        white-space: nowrap;
        list-style-type: none;
        padding: 0.25em;
    }

</style>
<svelte:head>
    <link rel="stylesheet" href="css/theme/dark.css" >
    <link rel="stylesheet" href="css/sample-svelte.css">
    <link rel="stylesheet" href="css/theme/all.css">
</svelte:head>
<Theme persist bind:theme>
    <Header expandedByDefault={false} persistentHamburgerMenu={true} company="HakuNeko" platformName="Manga & Anime - Downloader" bind:isSideNavOpen>
        <div slot="skip-to-content">
            <SkipToContent />
        </div>
        <HeaderUtilities>
            <HeaderSearch />
            <HeaderGlobalAction on:click={changeUIMode} aria-label="Wide" icon={SettingsAdjust20} />
            <HeaderAction bind:isOpen>
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
            </HeaderPanelLinks>
            </HeaderAction>
        </HeaderUtilities>
    </Header>

    <SideNav bind:isOpen={isSideNavOpen}>
        <SideNavItems>
            <SideNavLink text="Link 1" />
            <SideNavLink text="Link 2" />
            <SideNavLink text="Link 3" />
            <SideNavMenu text="Menu">
            <SideNavMenuItem href="/" text="Link 1" />
            <SideNavMenuItem href="/" text="Link 2" />
            <SideNavMenuItem href="/" text="Link 3" />
            </SideNavMenu>
        </SideNavItems>
    </SideNav>

    <Content id="hakunekoapp">
            <MangaSelect on:select={e => selectedManga = e.detail} />
            <ChapterSelect selectedManga={selectedManga} />
        {#if uimode === 'ui-mode-content' }
        <div class="Content" transition:fade>
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
        </div>
        {/if}
        <div class="Bottom" transition:fade>
            <Accordion align="start" size="sm">
                <AccordionItem title="Jobs">
                    <div slot="title"><InlineLoading status="active" description="Downloading..." /></div>
                    <p>
                        Bacon ipsum dolor amet chicken prosciutto brisket chislic. Turducken ham meatloaf ground round, jerky biltong salami chicken beef boudin. Andouille t-bone frankfurter pancetta. Flank andouille fatback, picanha buffalo hamburger short loin chislic cupim ham hock prosciutto biltong kielbasa meatloaf bresaola. Alcatra bresaola shank cupim filet mignon turducken. Pork belly shankle buffalo biltong sirloin. Cow meatloaf filet mignon, pork chop short ribs sirloin tri-tip brisket.
                    </p>
                </AccordionItem>
            </Accordion>
        </div>
    </Content>
</Theme>