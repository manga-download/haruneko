<script lang="ts">
    import {
        Header,HeaderUtilities,HeaderAction,HeaderSearch,HeaderGlobalAction,HeaderPanelLinks,HeaderPanelDivider,HeaderPanelLink,
        SideNav,SideNavItems,SideNavMenu, SideNavMenuItem, SideNavLink,
        SkipToContent,Content,
        SkeletonPlaceholder,
        Tabs, Tab, TabContent
    } from "carbon-components-svelte";
    import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";

    import { onMount } from 'svelte';

    import Theme from "./components/Theme.svelte";
    import MangaSelect from "./components/MangaSelect.svelte";
    import ChapterSelect from "./components/ChapterSelect.svelte";
    import Jobs from "./components/Jobs.svelte";
    import Console from "./components/Console.svelte";

    import { fade } from 'svelte/transition';

    import type {IManga, IChapter } from '../../engine/MangaProvider';

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

    let selectedManga: IManga| null;
    let selectedChapter: IChapter| null;
    let selectedBottomTab=0;

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

    #Content { grid-area: Content; }
    #Bottom {
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
    #BottomTabs{
        max-height:0;
    }
    #BottomTabs.fade-in {
        max-height:10em;
        animation: slide_in 0.5s ease-in-out;
	}
    #BottomTabs.fade-out {
        max-height:0;
        animation: slide_out 0.5s ease-in-out;
	}
    @keyframes slide_in {
        from {max-height: 0;}
        to {max-height: 10em;}
    }
    @keyframes slide_out {
        from {max-height: 10em;}
        to {max-height: 0;}
    }

    .tabcontent{
        height:10em;
        padding:0.2em;
        background-color: var(--manga-list-background-color);
    }

    :global(.bx--tab--content){
        padding:0;
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
        <div id="Content" transition:fade>
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
        </div>
        {/if}
        <div id="Bottom" transition:fade>
            <Tabs type="container" bind:selected={selectedBottomTab} >
                <Tab label="X" style="width:3em;" disabled={selectedBottomTab===0}/>
                <Tab label="Jobs" />
                <Tab label="Console" />
                <div id="BottomTabs" slot="content" class:fade-in={selectedBottomTab!==0} class:fade-out={selectedBottomTab===0} >
                        <TabContent tabindex={0} style="padding:0;"><div class="tabcontent"></div></TabContent>
                        <TabContent tabindex={1} style="padding:0;"><div class="tabcontent"><Jobs/></div></TabContent>
                        <TabContent tabindex={2} style="padding:0;"><div class="tabcontent"><Console/></div></TabContent>
                </div>
            </Tabs>
        </div>
    </Content>
</Theme>