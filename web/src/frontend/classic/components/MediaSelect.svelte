<script lang="ts">
    // UI: Carbon
    import {
        ComboBox,
        Button,
        Search,
        Loading,
        InlineNotification,
    } from 'carbon-components-svelte';

    import BookmarkFilled from 'carbon-icons-svelte/lib/BookmarkFilled.svelte';
    import UpdateNow from 'carbon-icons-svelte/lib/UpdateNow.svelte';
    import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
    import type {
        ComboBoxItem,
        ComboBoxItemId,
    } from 'carbon-components-svelte/src/ComboBox/ComboBox.svelte';
    // Third Party
    import Fuse from 'fuse.js';
    // Svelte
    import { fade } from 'svelte/transition';
    // UI: Components
    import Media from './Media.svelte';
    import Tracker from './Tracker.svelte';
    import VirtualList from '../lib/VirtualList.svelte';
    // UI : Stores
    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
    } from '../stores/Stores';
    import { FuzzySearch } from '../stores/Settings';
    // Hakuneko Engine
    import type {
        MediaContainer,
        MediaChild,
    } from '../../../engine/providers/MediaPlugin';
    import type { MediaInfoTracker } from '../../../engine/trackers/IMediaInfoTracker';
    import { Exception } from '../../../engine/Error';
    import { FrontendResourceKey as R } from '../../../i18n/ILocale';
    import { resizeBar } from '../lib/actions';
    import type { MediaContainer2 } from '../Types';

    // Plugins selection
    let currentPlugin: MediaContainer<MediaChild> = $state();
    let loadPlugin: Promise<MediaContainer<MediaChild>> = $state();

    let disablePluginRefresh = false;

    // TODO: implement favorites
    let pluginsFavorites = ['sheep-scanlations'];

    type ComboBoxItemWithValue = ComboBoxItem & {
        value: MediaContainer<MediaChild>;
        isFavorite: boolean;
    }
    const orderedPlugins: MediaContainer<MediaChild>[] = HakuNeko.PluginController.WebsitePlugins.toSorted((a, b) => {
            return (
                // sort by favorite
                (pluginsFavorites.includes(a.Identifier) ? 0 : 1) -
                    (pluginsFavorites.includes(b.Identifier) ? 0 : 1) ||
                //sort by string
                a.Title.localeCompare(b.Title)
            );
        });
    const pluginsCombo: ComboBoxItemWithValue[] = [
        {
            id: HakuNeko.BookmarkPlugin.Identifier,
            text: HakuNeko.BookmarkPlugin.Title,
            value : HakuNeko.BookmarkPlugin,
            isFavorite: true
        },
        ...orderedPlugins.map((plugin) => {
            return {
                id: plugin.Identifier,
                text: plugin.Title,
                value: plugin,
                isFavorite: pluginsFavorites.includes(plugin.Identifier),
            };
        }),
    ];

    let pluginDropdownSelected: string = $state();

    // Medias list
    let medias: MediaContainer<MediaChild>[] = $state([]);
    let mediaNameFilter = $state('');

    let filteredmedias: MediaContainer<MediaChild>[] = $state([]);
    $effect(() => {
        medias;
        filteredmedias = filterMedia(mediaNameFilter).sort((a, b) => 
            a.Title.localeCompare(b.Title)
        );
    });
    let fuse = new Fuse([]);

    loadPlugin = loadMedias($selectedPlugin);

    selectedPlugin.subscribe((newplugin) => {
        const previousPlugin = currentPlugin;
        loadPlugin = Promise.resolve(newplugin);
        currentPlugin = newplugin;
        pluginDropdownSelected = currentPlugin?.Identifier;
        if (!disablePluginRefresh && !currentPlugin?.IsSameAs(previousPlugin))
            loadMedias(newplugin);
        disablePluginRefresh = false;
    });

    async function loadMedias(
        plugin: MediaContainer<MediaChild>,
    ): Promise<MediaContainer<MediaChild>> {
        if (!plugin) return;
        const loadedmedias =
            (plugin.Entries.Value as MediaContainer<MediaChild>[]) ?? [];
        fuse = new Fuse(loadedmedias, {
            keys: ['Title'],
            findAllMatches: true,
            ignoreLocation: true,
            minMatchCharLength: 1,
            fieldNormWeight: 0,
        });
        medias = loadedmedias;
        return plugin;
    }
    
    /**
    * Filters the media items by title or plugin's name
    * @param {string} mediaNameFilter - The filter string to match
    * @returns {MediaContainer<MediaChild>[]} - An array of media items that match the filter criteria
    */
    function filterMedia(mediaNameFilter: string): MediaContainer<MediaChild>[] {
        if (mediaNameFilter === '') return medias;
        const mediasInPlugin: MediaContainer<MediaChild>[] = medias.filter((item) => item.Parent.Title.toLowerCase().includes(mediaNameFilter.toLowerCase()));
        let filteredMedia: MediaContainer<MediaChild>[] = [];
        if ($FuzzySearch)
            filteredMedia = fuse.search(mediaNameFilter).map((item) => item.item);
        else
            filteredMedia = medias.filter((item) =>
                item.Title.toLowerCase().includes(mediaNameFilter.toLowerCase())
            );
        // Remove duplicates
        return [...new Set([...filteredMedia, ...mediasInPlugin])];
    }

    let isTrackerModalOpen = $state(false);
    let selectedTracker: MediaInfoTracker = $state();

    function shouldFilterPlugin(item: any, value: string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }

    async function onUpdateMediaEntriesClick() {
        filteredmedias = []
        $selectedMedia = undefined;
        $selectedItem = undefined;
        loadPlugin = updatePlugin($selectedPlugin);
    }

    async function updatePlugin(plugin: MediaContainer<MediaChild>): Promise<MediaContainer<MediaChild>> {
        await plugin.Update();
        return loadMedias($selectedPlugin);
    }

    document.addEventListener('media-paste-url', onMediaPasteURL);
    async function onMediaPasteURL(_event: Event) {
        try {
            const link = new URL(await navigator.clipboard.readText()).href;
            for (const website of HakuNeko.PluginController.WebsitePlugins) {
                const media = await website.TryGetEntry(link);
                if (media) {
                    $selectedItem = undefined;
                    mediaNameFilter = '';
                    if (!$selectedPlugin?.IsSameAs(media.Parent)) {
                        disablePluginRefresh = true;
                        $selectedPlugin = media.Parent;
                    }
                    if (!$selectedMedia?.IsSameAs(media)) {
                        $selectedMedia = media;
                        medias = [media];
                        loadPlugin = Promise.resolve(media.Parent);
                    }
                    return;
                }
            }
            throw new Exception(R.Frontend_Media_PasteLink_NotFoundError, link);
        } catch (error) {
            console.warn(error);
        }
    }

    async function selectPlugin(id: ComboBoxItemId) {
        $selectedPlugin = [HakuNeko.BookmarkPlugin, ...orderedPlugins].find(
            (plugin) => plugin.Identifier === id,
        );
    }

    let medialistref : HTMLElement = $state();
    let medialistrefHeight = $state(0);
</script>

{#if isTrackerModalOpen}
    <div>
        <Tracker
            {isTrackerModalOpen}
            media={$selectedMedia}
            tracker={selectedTracker}
            on:close={() => (isTrackerModalOpen = false)}
        />
    </div>
{/if}
<div id="Media" transition:fade>
    <div id="MediaTitle">
        <h5>Media List</h5>
        <Button
            icon={CopyLink}
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="center"
            iconDescription="Paste media link"
            onclick={onMediaPasteURL}
        />
    </div>
    <div id="Plugin">
        <ComboBox
            id="PluginSelect"
            placeholder="Select a Plugin"
            bind:selectedId={pluginDropdownSelected}
            on:clear={async() => ($selectedPlugin = undefined)}
            on:select={async(event) => selectPlugin(event.detail.selectedId)}
            size="sm"
            items={pluginsCombo}
            shouldFilterItem={shouldFilterPlugin}
            let:item
        >
            {@const plugin = item as ComboBoxItemWithValue}
            {#if plugin.value.IsSameAs(HakuNeko.BookmarkPlugin)}
            <BookmarkFilled class="dropdown icon bookmarks" size={32} />
                <div class="dropdown title favorite">{plugin.value.Title}</div>
                <div>Your bookmarked medias</div>
            {:else}
                <img class="dropdown icon" alt={plugin.value.Title} src={plugin.value.Icon}/>
                <div class="dropdown title" class:favorite={plugin.isFavorite}>{plugin.value.Title}</div>
                <div>{plugin.value.URI}</div>
            {/if}
        </ComboBox> 
        <Button
            id="MediaUpdateButton"
            icon={UpdateNow}
            size="small"
            tooltipPosition="top"
            tooltipAlignment="center"
            iconDescription="Update"
            style="float: right;"
            onclick={onUpdateMediaEntriesClick}
        />
    </div>

    <div id="MediaFilter">
        <Search id="MediaFilterSearch" size="sm" bind:value={mediaNameFilter} />
    </div>
    <div id="MediaList" class="list" bind:this={medialistref} bind:clientHeight={medialistrefHeight}>
        {#await loadPlugin}
            <div class="loading center">
                <div><Loading withOverlay={false} /></div>
                <div>... medias</div>
            </div>
        {:catch error}
            <div class="error">
                <InlineNotification
                    lowContrast
                    title={error.name}
                    subtitle={error.message}
                />
            </div>
        {/await}
        <VirtualList items={filteredmedias as MediaContainer2[]} itemHeight={24} container={medialistref} containerHeight={medialistrefHeight}>
            {#snippet children(item)}
                <div class="media">
                        <Media 
                        media={item}
                        /> 
                </div>
            {/snippet}
        </VirtualList>
    </div>
    <div id="MediaCount">
        Medias : {filteredmedias.length}/{medias.length}
    </div>
    <div 
        role="separator"
        aria-orientation="vertical"
        class="resize"
        use:resizeBar={{orientation:'vertical'}}
    > </div>
    
</div>

<style>
    #Media {
        min-height: 0;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 4px;
        grid-template-rows: 2.2em 2.2em 2.2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            'MediaTitle Empty'
            'Plugin Resize'
            'MediaFilter Resize'
            'MediaList Resize'
            'MediaCount Resize';
        grid-area: Media;
        min-width: 22em;
    }
    #Plugin {
        grid-area: Plugin;
        display: grid;
        grid-template-columns: 1fr auto;
    }
    #Plugin .dropdown.icon {
        width: 2em;
        height: 2em;
        float:left;
        margin-right: 0.5em;
        border-radius: 20%;
    }

    #Plugin :global(.dropdown.icon.bookmarks) {
        width: 2em;
        height: 2em;
        float:left;
        margin-right: 0.5em;
    }
    #Plugin .dropdown.title {
        font-weight: bold;
    }
    #Plugin .dropdown.title.favorite::before{
        content:"⭐";
    }
    #Plugin :global(.bx--list-box__menu-item)    {
        height: 3.5em;
    }
    #Plugin :global(.bx--list-box__menu-item__option)    {
        height: 3em;
    }
    #MediaFilter {
        grid-area: MediaFilter;
        display: grid;
        grid-template-columns: 1fr auto;
    }
    #MediaList {
        grid-area: MediaList;
        box-sizing: border-box;
        width: 100%;
        overflow-x: hidden;
        background-color: var(--cds-field-01);
        user-select: none;
    }
    #MediaList .loading {
        width: 100%;
        height: 100%;
    }
    #MediaList :global(.items) {
        flex: 1;
        overflow-x: hidden !important;
    }
    #MediaCount {
        grid-area: MediaCount;
        margin: 0.25em;
    }
    #MediaTitle h5 {
        display: inline-block;
        height: 100%;
        padding-top: 0.3em;
    }
    .error {
        padding: 0 1em 0 1em;
    }
    .resize {
        grid-area: Resize;
        width:4px;
        cursor: col-resize;
    }
    .resize:hover {
            background-color:var(--cds-ui-02); 
    }
</style>
