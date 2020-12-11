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

    import InterfaceTheme,{themes} from "./components/Theme.svelte";
    import MangaSelect from "./components/MangaSelect.svelte";
    import ChapterSelect from "./components/ChapterSelect.svelte";
    import Jobs from "./components/Jobs.svelte";
    import Console from "./components/Console.svelte";
    import Home from "./components/Home.svelte";
    import Viewer from "./components/Viewer.svelte";

    import { fade } from 'svelte/transition';

    import type {IManga, IChapter } from '../../engine/MangaProvider';

    let isSideNavOpen = false;
    let isOpen = false;
    let theme:string;

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
    let currentContent='home';
    let showHome=true;

    $:currentContent=selectedChapter? 'viewer' : 'home';

</script>
<style>
    :global(::-webkit-scrollbar) {
    width: 1em; /* Necessary so scrollbar changes from default*/
    }
    :global(::-webkit-scrollbar-track) {
        background:var(--cds-ui-background); /* Background of scrollbar */
    }
    :global(::-webkit-scrollbar-thumb) {
        background:var(--cds-active-ui); /* Scroll marker */
        border-radius: 2em; /* So marker has rounded edges */
    }
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
        gap: 0.3em 0.3em;
        grid-template-rows: 1fr fit-content(0.5em);
    }
    :global(.ui-mode-content)  { 
        grid-template-columns: 19em 19em 1fr;
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
        border-top: 1px groove var(--cds-button-separator);
    }
    #BottomTabs{
        max-height:0;
        transition: max-height 0.5s;
    }
    #BottomTabs.open {
        max-height:10em;
	}

    .tabcontent{
        height:10em;
        padding:0.2em;
        background-color: var(--cds-field-01);
    }

    :global(#BottomTabs .bx--tab--content){
        padding:0;
    }

</style>
<svelte:head>
    <link rel="stylesheet" href="css/sample-svelte.css">
    <link rel="stylesheet" href="css/theme/all.css">
    <link rel="stylesheet" href="css/theme/hakuneko.css">
</svelte:head>
<InterfaceTheme persist bind:theme>
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
                <HeaderPanelDivider>Themes</HeaderPanelDivider>
                {#each themes as item}
                    <HeaderPanelLink on:click={() => theme=item.id}>{item.label}</HeaderPanelLink>
                {/each}
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
            <ChapterSelect selectedManga={selectedManga} on:view={e => selectedChapter = e.detail} />
        {#if uimode === 'ui-mode-content' }
        <div id="Content" transition:fade>
            {#if currentContent==='home' && showHome}
                <Home/>
            {:else if currentContent==='viewer'}
                <Viewer chapter={selectedChapter}/>
            {/if}
        </div>
        {/if}
        <div id="Bottom" transition:fade>
            <Tabs type="container" bind:selected={selectedBottomTab} >
                <Tab label="X" style="width:3em;" disabled={selectedBottomTab===0}/>
                <Tab label="Jobs" />
                <Tab label="Console" />
                <div id="BottomTabs" slot="content" class:open={selectedBottomTab!==0} >
                        <TabContent tabindex={0} style="padding:0;"><div class="tabcontent"></div></TabContent>
                        <TabContent tabindex={1} style="padding:0;"><div class="tabcontent"><Jobs/></div></TabContent>
                        <TabContent tabindex={2} style="padding:0;"><div class="tabcontent"><Console/></div></TabContent>
                </div>
            </Tabs>
        </div>
    </Content>
</InterfaceTheme>