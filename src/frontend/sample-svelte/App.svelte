<script lang="ts">
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderActionSearch,
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
        ComboBox,
        Button,
        Search,
        Dropdown,
        Accordion, AccordionItem,
        InlineLoading,
        SkeletonPlaceholder,
        Grid,
        Icon,
    } from "carbon-components-svelte";
    import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";
    import EarthFilled16 from "carbon-icons-svelte/lib/EarthFilled16";
    import PlugFilled16 from "carbon-icons-svelte/lib/PlugFilled16";

    // Meh ?
    import VirtualList from "@sveltejs/svelte-virtual-list";

    import { onMount } from 'svelte';

    import Theme from "./components/Theme.svelte";
    import Manga from "./components/Manga.svelte";
    import Chapter from "./components/Chapter.svelte";

    import type {IMangaHost,IManga, IChapter } from '../../engine/MangaProvider';

    let isSideNavOpen = false;
    let isSideNavFixed=true;
    let isOpen = false;
    let isHeaderExpandedByDefault = false;

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

    let plugins: Array<IMangaHost> = window.HakuNeko.PluginController.WebsitePlugins as IMangaHost[];
    let pluginsCombo: Array<any>;
    $: pluginsCombo = Array.from(plugins,(plugin,key) => {return {id: key, text: plugin.Title}});
    let selectedPluginCombo = 1; //fucking combobox not handling object binding
    let selectedPlugin: IMangaHost;
    $: selectedPlugin = plugins[selectedPluginCombo];

    let mangas: Promise<IManga[]> = Promise.resolve([]);
    $: mangas = selectedPlugin ? selectedPlugin.GetMangas() : Promise.resolve([]);
    let selectedManga: IManga;

    let chapters: Promise<IChapter[]>;
    $: chapters = selectedManga ? selectedManga.GetChapters() : Promise.resolve([]);
    let selectedChapter: IChapter;

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
        grid-template-rows: 30fr fit-content(0.5em);
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

    .Manga {
        min-height: 0;
        display: grid;
        grid-template-rows: 2em 2em 2em 1fr;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "MangaTitle"
            "Connector"
            "MangaFilter"
            "MangaList"
            "MangaCount";
        grid-area: Manga;
    }
    .Connector { grid-area: Connector; display: table; }
    .MangaFilter { grid-area: MangaFilter; display: table; }
    .MangaList { grid-area: MangaList; overflow-y: scroll; overflow-x: hidden }
    .MangaCount{grid-area: MangaCount; margin:0.25em;}

    :global(#connector-combo) { 
        display:table-cell;
        width:100%
    }
    .Chapter {
        display: grid;
        grid-template-rows: 2em 2em 2em 1fr;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "ChapterTitle"
            "LanguageFilter"
            "ChapterFilter"
            "ChapterList"
            "ChapterCount";
        grid-area: Chapter;
    }
    .LanguageFilter { grid-area: LanguageFilter; display: table; }
    .ChapterFilter {  grid-area: ChapterFilter; display: table; }
    .ChapterList { grid-area: ChapterList; overflow-y: scroll; overflow-x:hidden}
    .ChapterCount { grid-area: ChapterCount; margin:0.25em;}
    
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

    .separator {
        border-bottom: var(--manga-control-separator);
    }

    .inline{
        width:fit-content;
    }
    .inline-wide{
        display:table-cell;
        width:100%;
    }


</style>
<svelte:head>
    <link rel="stylesheet" href="css/theme/dark.css" >
    <link rel="stylesheet" href="css/sample-svelte.css">
    <link rel="stylesheet" href="css/theme/all.css">
</svelte:head>
<Theme persist bind:theme>
    <Header expandedByDefault={isHeaderExpandedByDefault} company="HakuNeko" platformName="Manga & Anime - Downloader" bind:isSideNavOpen>
        <div slot="skip-to-content">
            <SkipToContent />
        </div>
        <HeaderUtilities>
            <HeaderActionSearch />
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

    <SideNav fixed={isSideNavFixed} bind:isOpen={isSideNavOpen}>
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
        <div class="Manga">
            <div class="MangaTitle">
                <h5 class="separator">Manga List</h5>
            </div>
            <div class="Connector">
                <div class="inline">
                    <Button 
                        icon={PlugFilled16}
                        hasIconOnly
                        size="small"
                        tooltipPosition="bottom"
                        tooltipAlignment="center"
                        iconDescription="Connector"
                        
                    />
                </div>
                <div class="inline-wide">
                    <ComboBox
                        placeholder="Select a connector"
                        bind:selectedIndex={selectedPluginCombo}
                        size="sm"
                        items={pluginsCombo}
                    />
                </div>
            </div>
            <div class="MangaFilter">
                <Search size="sm" />
            </div>
            <div class="MangaList list">
                {#await mangas}
                    <InlineLoading status="active" description="Working..." />
                {:then mangas}
                    <VirtualList items={mangas} let:item>
                        <Manga manga={item} bind:selected={selectedManga}/>
                    </VirtualList>
                {:catch error}
                    <p style="color: red">{error.message}</p>
                {/await}
            </div>
            <div class="MangaCount">
                {#await mangas}
                    Mangas : ?
                {:then mangas}
                    Mangas : {mangas.length}
                {:catch error}
                    Mangas : ?
                {/await}
            </div>
        </div>
        <div class="Chapter">
            <div class="ChapterTitle">
                <h5 class="separator">Chapter List</h5>
            </div>
            <div class="LanguageFilter">
                <div class="inline">
                <Button 
                    icon={EarthFilled16}
                    hasIconOnly
                    size="small"
                    tooltipPosition="bottom"
                    tooltipAlignment="center"
                    iconDescription="Connector"
                />
                </div>
                <div class="inline-wide">
                    <Dropdown
                        selectedIndex={0}
                        size="sm"
                        items={[{ id: '0', text: '*' }, { id: '1', text: 'gb' }, { id: '2', text: 'fr' }]}
                        
                    />
                </div>
            </div>
            <div class="ChapterFilter">
                <Search size="sm"/>
            </div>
            <div class="ChapterList list">
                {#await chapters}
                    <InlineLoading status="active" description="Working..." />
                {:then chapters}
                    <Grid fullWidth  narrow>
                        {#each chapters as chapter, i}
                            <Chapter display="Row" chapter={chapter} bind:selected={selectedChapter}/>
                        {/each}
                    </Grid>
                {:catch error}
                    <p style="color: red">{error.message}</p>
                {/await}
            </div>
            <div class="ChapterCount">
                {#await chapters}
                    Chapters: ?
                {:then chapters}
                    Chapters: {chapters.length}
                {:catch error}
                    Chapters: ?
                {/await}
            </div>
        </div>
        {#if uimode === 'ui-mode-content' }
        <div class="Content">
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
            <SkeletonPlaceholder />
        </div>
        {/if}
        <div class="Bottom">
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