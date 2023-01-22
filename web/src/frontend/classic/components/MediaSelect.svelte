<script lang="ts">
    // UI: Carbon
    import {
        ComboBox,
        Button,
        Search,
        Loading,
    } from 'carbon-components-svelte';
    import { Star, StarFilled, UpdateNow } from 'carbon-icons-svelte';
    import type { ComboBoxItem } from 'carbon-components-svelte/types/ComboBox/ComboBox.svelte';
    // Third Party
    import Fuse from 'fuse.js';
    // Svelte
    import { fade } from 'svelte/transition';
    import VirtualList from '@sveltejs/svelte-virtual-list';
    // UI: Components
    import Media from './Media.svelte';
    import Tracker from './Tracker.svelte';
    // UI : Stores
    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
    } from '../stores/Stores';
    import { FuzzySearchValue } from '../stores/Settings';
    // Hakuneko Engine
    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import type { IMediaInfoTracker } from '../../../engine/trackers/IMediaInfoTracker';

    let medias: IMediaContainer[] = [];
    let filteredmedias: IMediaContainer[] = [];
    let fuse = new Fuse(medias, {
        keys: ['Title'],
        findAllMatches: true,
        ignoreLocation: true,
        minMatchCharLength: 1,
        fieldNormWeight: 0,
    });

    $selectedPlugin = window.HakuNeko.BookmarkPlugin;

    let loadPlugin: Promise<void>;
    let isBookmarkPlugin: Boolean;
    $: isBookmarkPlugin = $selectedPlugin === window.HakuNeko.BookmarkPlugin;

    // Todo : implement favorites
    let pluginsFavorites = ['sheep-scanlations'];

    let pluginsCombo: Array<ComboBoxItem>;
    let orderedPlugins: IMediaContainer[] = [];

    orderedPlugins = HakuNeko.PluginController.WebsitePlugins.sort((a, b) => {
        return (
            // sort by favorite
            (pluginsFavorites.includes(a.Identifier) ? 0 : 1) -
                (pluginsFavorites.includes(b.Identifier) ? 0 : 1) ||
            //sort by string
            a.Title.localeCompare(b.Title)
        );
    });
    pluginsCombo = orderedPlugins.map((plugin) => {
        return {
            id: plugin.Identifier,
            text: plugin.Title,
        };
    });

    function pluginsComboText(item: ComboBoxItem): string {
        return pluginsFavorites.includes(item.id)
            ? '⭐' + item.text
            : item.text;
    }

    let pluginDropdownSelected: string;
    let currentPlugin: string;

    selectedPlugin.subscribe((value) => {
        if (!value || value?.Identifier === currentPlugin) return;
        currentPlugin = pluginDropdownSelected = value.Identifier;
        medias = (value?.Entries as IMediaContainer[]) ?? [];
        fuse = new Fuse(medias, {
            keys: ['Title'],
            findAllMatches: true,
            ignoreLocation: true,
            minMatchCharLength: 1,
            fieldNormWeight: 0,
        });
        $selectedMedia = undefined;
        $selectedItem = undefined;
    });
    function filterMedia(mediaNameFilter: string): IMediaContainer[] {
        if ($FuzzySearchValue)
            return fuse.search(mediaNameFilter).map((item) => item.item);
        else
            return medias.filter((item) =>
                item.Title.includes(mediaNameFilter)
            );
    }
    let mediaNameFilter = '';
    $: filteredmedias =
        mediaNameFilter === '' ? medias : filterMedia(mediaNameFilter);

    let isTrackerModalOpen = false;
    let selectedTracker: IMediaInfoTracker;

    function shouldFilterPlugin(item: any, value: string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }

    async function onUpdateMediaEntriesClick() {
        loadPlugin = $selectedPlugin?.Update();
        await loadPlugin;
        medias = ($selectedPlugin?.Entries as IMediaContainer[]) ?? [];
    }
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
        <Button
            kind="ghost"
            size="small"
            iconDescription="Show bookmarks"
            tooltipPosition="right"
            icon={isBookmarkPlugin ? StarFilled : Star}
            on:click={() => {
                $selectedPlugin = window.HakuNeko.BookmarkPlugin;
            }}
        />
        <h5>Media List</h5>
    </div>
    <div id="Plugin">
        <div class="inline-wide">
            <ComboBox
                placeholder="Select a Plugin"
                bind:selectedId={pluginDropdownSelected}
                on:select={(event) =>
                    ($selectedPlugin = orderedPlugins.find(
                        (plugin) =>
                            plugin.Identifier === event.detail.selectedId
                    ))}
                size="sm"
                items={pluginsCombo}
                shouldFilterItem={shouldFilterPlugin}
                itemToString={pluginsComboText}
            />
        </div>

        <div class="inline">
            <Button
                icon={UpdateNow}
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Update"
                on:click={onUpdateMediaEntriesClick}
            />
        </div>
    </div>

    <div id="MediaFilter">
        <Search size="sm" bind:value={mediaNameFilter} />
    </div>
    <div id="MediaList" class="list">
        {#await loadPlugin}
            <div class="loading center">
                <div><Loading withOverlay={false} /></div>
                <div>... medias</div>
            </div>
        {:then}
            <VirtualList items={filteredmedias} let:item>
                <Media
                    media={item}
                    on:select={(e) => {
                        $selectedMedia = e.detail;
                    }}
                />
            </VirtualList>
        {:catch}
            Error loading medias
        {/await}
    </div>
    <div id="MediaCount">
        Medias : {filteredmedias.length}/{medias.length}
    </div>
</div>

<style>
    #Media {
        min-height: 0;
        height: 100%;
        display: grid;
        grid-template-rows: 2.2em 2em 2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            'MediaTitle'
            'Plugin'
            'MediaFilter'
            'MediaList'
            'MediaCount';
        grid-area: Media;
    }
    #Plugin {
        grid-area: Plugin;
        display: table;
    }
    #MediaFilter {
        grid-area: MediaFilter;
        display: table;
    }
    #MediaList {
        grid-area: MediaList;
        background-color: var(--cds-field-01);
        overflow: hidden;
        user-select: none;
    }
    #MediaList .loading {
        width: 100%;
        height: 100%;
    }
    #MediaCount {
        grid-area: MediaCount;
        display: table;
        margin: 0.25em;
    }
    :global(#Plugin-combo) {
        display: table-cell;
        width: 100%;
    }
    #MediaTitle h5 {
        display: inline-block;
        height: 100%;
        padding-top: 0.3em;
    }

    .inline {
        width: fit-content;
    }
    .inline-wide {
        display: table-cell;
        width: 100%;
    }
</style>
