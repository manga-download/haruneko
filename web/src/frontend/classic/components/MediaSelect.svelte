<script lang="ts">
    // UI: Carbon
    import {
        ComboBox,
        Button,
        Search,
        Loading,
        InlineNotification,
    } from 'carbon-components-svelte';

    import { UpdateNow, CopyLink } from 'carbon-icons-svelte';
    import type {
        ComboBoxItem,
        ComboBoxItemId,
    } from 'carbon-components-svelte/src/ComboBox/ComboBox.svelte';
    // Third Party
    import Fuse from 'fuse.js';
    // Svelte
    import { fade } from 'svelte/transition';
    import VirtualList from '../lib/virtualList.svelte';
    // UI: Components
    import Media from './Media.svelte';
    import Tracker from './Tracker.svelte';
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

    let ref:HTMLElement;

    // Plugins selection
    let currentPlugin: MediaContainer<MediaChild>;
    let loadPlugin: Promise<MediaContainer<MediaChild>>;

    let disablePluginRefresh = false;

    // TODO: implement favorites
    let pluginsFavorites = ['sheep-scanlations'];

    let pluginsCombo: Array<ComboBoxItem>;
    let orderedPlugins: MediaContainer<MediaChild>[] = [];

    orderedPlugins = HakuNeko.PluginController.WebsitePlugins.sort((a, b) => {
        return (
            // sort by favorite
            (pluginsFavorites.includes(a.Identifier) ? 0 : 1) -
                (pluginsFavorites.includes(b.Identifier) ? 0 : 1) ||
            //sort by string
            a.Title.localeCompare(b.Title)
        );
    });
    pluginsCombo = [
        {
            id: HakuNeko.BookmarkPlugin.Identifier,
            text: '📚 Bookmarks',
        },
        ...orderedPlugins.map((plugin) => {
            return {
                id: plugin.Identifier,
                text: plugin.Title,
            };
        }),
    ];

    function pluginsComboText(item: ComboBoxItem): string {
        return pluginsFavorites.includes(item.id)
            ? '⭐' + item.text
            : item.text;
    }
    $: {
        const previousPlugin = currentPlugin;
        currentPlugin = $selectedPlugin;
        if (!disablePluginRefresh && !currentPlugin?.IsSameAs(previousPlugin))
            loadMedias($selectedPlugin);
        disablePluginRefresh = false;
    }
    $: pluginDropdownSelected = currentPlugin?.Identifier;

    // Medias list
    let medias: MediaContainer<MediaChild>[] = [];
    let filteredmedias: MediaContainer<MediaChild>[] = [];
    let fuse = new Fuse([]);

    $: loadPlugin = loadMedias($selectedPlugin);
    async function loadMedias(
        plugin: MediaContainer<MediaChild>,
    ): Promise<MediaContainer<MediaChild>> {
        if (!plugin) return;
        const loadedmedias =
            (plugin.Entries.Value as MediaContainer<MediaChild>[]) ?? [];
        fuse = new Fuse(medias, {
            keys: ['Title'],
            findAllMatches: true,
            ignoreLocation: true,
            minMatchCharLength: 1,
            fieldNormWeight: 0,
        });
        medias = loadedmedias;
        return plugin;
    }

    function filterMedia(mediaNameFilter: string) {
        if ($FuzzySearch)
            return fuse.search(mediaNameFilter).map((item) => item.item);
        else
            return medias.filter((item) =>
                item.Title.includes(mediaNameFilter),
            );
    }
    let mediaNameFilter = '';
    $: filteredmedias =
        mediaNameFilter === '' ? medias : filterMedia(mediaNameFilter);

    let isTrackerModalOpen = false;
    let selectedTracker: MediaInfoTracker;

    function shouldFilterPlugin(item: any, value: string) {
        if (!value) return true;
        return item.text.toLowerCase().includes(value.toLowerCase());
    }

    async function onUpdateMediaEntriesClick() {
        $selectedMedia = undefined;
        $selectedItem = undefined;
        await $selectedPlugin.Update();
        loadPlugin = loadMedias($selectedPlugin);
    }

    document.addEventListener('media-paste-url', onMediaPasteURL);
    async function onMediaPasteURL(_event: Event) {
        try {
            const link = new URL(await navigator.clipboard.readText()).href;
            for (const website of HakuNeko.PluginController.WebsitePlugins) {
                const media = await website.TryGetEntry(link);
                if (media) {
                    $selectedItem = undefined;
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

    let pluginDropdownValue: string;
    async function selectFocus(event: FocusEvent) {
        pluginDropdownValue = '';
    }
    // VirtualList
    let container:HTMLElement;
    let containerHeight = 0;
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
<div id="Media" transition:fade bind:this={ref}>
    <div id="MediaTitle">
        <h5>Media List</h5>
        <Button
            icon={CopyLink}
            size="small"
            kind="ghost"
            tooltipPosition="right"
            tooltipAlignment="center"
            iconDescription="Paste media link"
            on:click={onMediaPasteURL}
        />
    </div>
    <div id="Plugin">
        <ComboBox
            placeholder="Select a Plugin"
            bind:selectedId={pluginDropdownSelected}
            bind:value={pluginDropdownValue}
            on:clear={() => ($selectedPlugin = undefined)}
            on:select={(event) => selectPlugin(event.detail.selectedId)}
            size="sm"
            items={pluginsCombo}
            shouldFilterItem={shouldFilterPlugin}
            itemToString={pluginsComboText}
        />
        <Button
            icon={UpdateNow}
            size="small"
            tooltipPosition="top"
            tooltipAlignment="center"
            iconDescription="Update"
            style="float: right;"
            on:click={onUpdateMediaEntriesClick}
        />
    </div>

    <div id="MediaFilter">
        <Search size="sm" bind:value={mediaNameFilter} />
    </div>
    <div id="MediaList" class="list" bind:this={container} bind:clientHeight={containerHeight}>
        {#await loadPlugin}
            <div class="loading center">
                <div><Loading withOverlay={false} /></div>
                <div>... medias</div>
            </div>
        {:then}
            <VirtualList {container} items={filteredmedias} itemHeight={24}  {containerHeight} let:item let:dummy let:y>
                {#if dummy}
                    <div class="empty" class:dummy style="position: relative; top:{y}px;"></div>
                {:else}
                    {#key item}
                        <Media 
                            media={item}
                            style="position: relative; top:{y}px;"
                            on:select={(e) => {
                                $selectedMedia = e.detail;
                            }}
                        />
                    {/key}
                {/if}
            </VirtualList>
        {:catch error}
            <div class="error">
                <InlineNotification
                    lowContrast
                    title={error}
                    subtitle={error.message}
                />
            </div>
        {/await}
    </div>
    <div id="MediaCount">
        Medias : {filteredmedias.length}/{medias.length}
    </div>
    <div 
        role="separator"
        aria-orientation="vertical"
        class="resize"
        use:resizeBar={{target: ref, orientation:'vertical'}}
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
    #MediaFilter {
        grid-area: MediaFilter;
        display: grid;
        grid-template-columns: 1fr auto;
    }
    #MediaList {
        grid-area: MediaList;
        background-color: var(--cds-field-01);
        box-shadow: inset 0 0 0.2em 0.2em var(--cds-ui-background);
        overflow: hidden;
        user-select: none;
        overflow: auto;
    }
    #MediaList .loading {
        width: 100%;
        height: 100%;
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
    .empty {
        height: 24px;
        line-height: 24px;
    }
</style>
