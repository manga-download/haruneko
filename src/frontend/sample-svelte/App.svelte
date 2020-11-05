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
        UnorderedList, ListItem,
        Accordion, AccordionItem,
        InlineLoading,
        SkeletonPlaceholder,
    } from "carbon-components-svelte";
    import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";
    import EarthFilled16 from "carbon-icons-svelte/lib/EarthFilled16";
    import PlugFilled16 from "carbon-icons-svelte/lib/PlugFilled16";

    import Theme from "./components/Theme.svelte";

    let isSideNavOpen = false;
    let isOpen = false;
    let theme = "g90";
</script>
<style>
:global(#hakunekoapp) {
    height: calc(100vh - 3.5em);
    max-height: calc(100vh - 3.5em);
    display: grid;
    padding:0.5em; 
    grid-template-columns: 20em 20em 1fr;
    grid-template-rows: 30fr fit-content(0.5em);
    gap: 0.3em 0.3em;
    grid-template-areas:
        "Manga Chapter Content"
        "Bottom Bottom Content";
}

::-webkit-scrollbar {
    width: 1em; /* Necessary so scrollbar changes from default*/
}

::-webkit-scrollbar-track {
    background:#36393f; /* Background of scrollbar */
}

::-webkit-scrollbar-thumb {
    background:#202225; /* Scroll marker */
    border-radius: 2em; /* So marker has rounded edges */
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
        "MangaList";
    grid-area: Manga;
}
.MangaList { grid-area: MangaList; overflow-y: scroll; }
.Connector { grid-area: Connector; display:table; }
.MangaFilter { grid-area: MangaFilter; display:table; }
.Chapter {
    display: grid;
    grid-template-rows: 2em 2em 2em 1fr;
    gap: 0.3em 0.3em;
    grid-template-areas:
        "ChapterTitle"
        "LanguageFilter"
        "ChapterFilter"
        "ChapterList";
    grid-area: Chapter;
}
.ChapterList { grid-area: ChapterList; }
.LanguageFilter { grid-area: LanguageFilter; display:table; }
.ChapterFilter {  grid-area: ChapterFilter; display:table; }
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
</style>
<svelte:head>
    <link rel="stylesheet" href="css/theme/dark.css" >
    <link rel="stylesheet" href="css/sample-svelte.css">
    <link rel="stylesheet" href="https://unpkg.com/carbon-components-svelte@0.14.0/css/all.css">
</svelte:head>
<Theme persist bind:theme>
    <Header expandedByDefault={false} company="HakuNeko" platformName="Manga & Anime - Downloader" bind:isSideNavOpen>
        <div slot="skip-to-content">
            <SkipToContent />
        </div>
        <HeaderUtilities>
            <HeaderActionSearch />
            <HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust20} />
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

    <SideNav fixed={true} bind:isOpen={isSideNavOpen}>
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
            <div class="Manga separator">
                <div class="MangaTitle">
                    <h5 class="separator">Manga List</h5>
                </div>
                <div class="Connector">
                    <Button 
                        icon={PlugFilled16}
                        hasIconOnly
                        size="small"
                        tooltipPosition="bottom"
                        tooltipAlignment="center"
                        iconDescription="Connector"
                    />
                    <ComboBox
                        placeholder="Select a connector"
                        selectedIndex={0}
                        size="sm"
                        items={[{ id: '0', text: 'Bookmark' }, { id: '1', text: 'MangaHere' }, { id: '2', text: 'MangaDex' }]}
                    />
                </div>
                <div class="MangaFilter">
                    <Search size="sm" />
                </div>
                <div class="MangaList list">
                    <UnorderedList >
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                        <ListItem>Manga 1</ListItem>
                        <ListItem>Manga 2</ListItem>
                        <ListItem>Manga 3</ListItem>
                    </UnorderedList>
                </div>
            </div>
            <div class="Chapter">
                <div class="ChapterTitle">
                    <h5 class="separator">Chapter List</h5>
                </div>
                <div class="LanguageFilter">
                    <Button 
                        icon={EarthFilled16}
                        hasIconOnly
                        size="small"
                        tooltipPosition="bottom"
                        tooltipAlignment="center"
                        iconDescription="Connector"
                    />
                    <Dropdown
                        selectedIndex={0}
                        size="sm"
                        items={[{ id: '0', text: '*' }, { id: '1', text: 'gb' }, { id: '2', text: 'fr' }]}
                    />
                </div>
                <div class="ChapterFilter">
                    <Search size="sm" />
                </div>
                <div class="ChapterList list">
                    <UnorderedList>
                        <ListItem>Chapter 1</ListItem>
                        <ListItem>Chapter 2</ListItem>
                        <ListItem>Chapter 3</ListItem>
                    </UnorderedList>
                </div>
            </div>
            <div class="Content">
                <SkeletonPlaceholder />
                <SkeletonPlaceholder />
                <SkeletonPlaceholder />
                <SkeletonPlaceholder />

            </div>
            <div class="Bottom">
                <Accordion align="start" size="sm">
                    <AccordionItem title="Jobs">
                        <div slot="title"><InlineLoading status="active" description="Downloading..." /></div>
                        <p>
                            Natural Language Classifier uses advanced natural language processing and
                            machine learning techniques to create custom classification models. Users
                            train their data and the service predicts the appropriate category for the
                            inputted text.
                        </p>
                    </AccordionItem>
                </Accordion>
            </div>
    </Content>
</Theme>