<script lang="ts">
    import {
        Button,
        ContextMenu,
        ContextMenuDivider,
        ContextMenuGroup,
        ContextMenuOption,
        Dropdown,
        InlineNotification,
        Loading,
        MenuButton,
        MenuItem,
        Search,
    } from 'carbon-components-svelte';
    import ChevronSort from 'carbon-icons-svelte/lib/ChevronSort.svelte';
    import EarthFilled from 'carbon-icons-svelte/lib/EarthFilled.svelte';
    import CloudDownload from 'carbon-icons-svelte/lib/CloudDownload.svelte';

    import { fade } from 'svelte/transition';

    import MediaComponent from './MediaItem.svelte';
    import { Store as UI } from '../stores/Stores.svelte';
    import { Tags, type Tag } from '../../../engine/Tags';
    const availableLanguageTags = Tags.Language.toArray();
    import { GlobalSettings } from '../stores/Settings.svelte';

    import type {
        StoreableMediaContainer,
        MediaItem,
        MediaContainer,
        MediaChild,
    } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { resizeBar } from '../lib/actions';
    import { Key as GlobalKey } from '../../../engine/SettingsGlobal';
    import type { Directory } from '../../../engine/SettingsManager';

    let items: MediaContainer<MediaItem>[] = $state([]);
    let filteredItems: MediaContainer<MediaItem>[] = $state([]);
    let selectedItems: MediaContainer<MediaItem>[] = $state([]);
    let reverseSortOrder: boolean = $state(false);

    let loadItem: Promise<MediaContainer<MediaChild>> = $state();

    $effect(() => {
        loadItem = updateMedia(UI.selectedMedia);
    });

    /**
     * Updates the displayed items from the selected media container.
     *
     * @param media - The media container whose entries should be displayed.
     * @returns A promise resolving to the provided media container.
     */
    async function updateMedia( media: MediaContainer<MediaChild> ): Promise<MediaContainer<MediaChild>> {
        items = [];
        selectedItems = [];
        return new Promise(async (resolve, reject) => {
            try {
                if (media) {
                    await media?.Update();
                    items = media?.Entries.Value as MediaContainer<MediaItem>[];
                }
                resolve(media);
            } catch (error) {
                reject(error);
            }
        });
    }

    $effect(() => {
        const position = filteredItems.indexOf(UI.selectedItem);
        UI.selectedItemPrevious = filteredItems[position + 1];
        UI.selectedItemNext = filteredItems[position - 1];
    });

    /**
     * Creates a handler that selects an item when it is viewed directly.
     *
     * @param item - The item associated with the handler.
     * @returns A mouse event handler for the item.
     */
    const onItemView = (item: MediaContainer<MediaItem>) => (event:MouseEvent) => {
        event.stopPropagation();
        if (item === UI.selectedItem || event.ctrlKey || event.shiftKey) return;
        UI.selectedItem = item;
    };

    let itemNameFilter = $state('');
    
    $effect(() => {
        filteredItems = items?.filter((item) => {
            let conditions: boolean[] = [];
            if (itemNameFilter)
                conditions.push(
                    item.Title.toLowerCase().indexOf(
                        itemNameFilter.toLowerCase(),
                    ) !== -1,
                );
            if (langFilter) conditions.push(item.Tags.Value.includes(langFilter));
            return conditions.every((condition) => condition);
        });
    });
    let showItems = $derived(reverseSortOrder ? filteredItems.toReversed() : filteredItems);

    let itemsdiv: HTMLElement = $state();

    let MediaLanguages: Tag[] = $derived(
        items.reduce((detectedLangaugeTags: Tag[], item) => {
            const undetectedLangaugeTags = item.Tags.Value.filter(
                (tag) =>
                    !detectedLangaugeTags.includes(tag) &&
                    availableLanguageTags.includes(tag),
            );
            return [...detectedLangaugeTags, ...undetectedLangaugeTags];
        }, [])
    );
    let langComboboxItems =
        $derived(MediaLanguages.length > 0
            ? [
                { id: '*', text: '*' },
                ...MediaLanguages.map((lang) => {
                    return { id: lang, text: GlobalSettings.Locale[lang.Title]() };
                }),
            ]
            : [{ id: '*', text: '*' }]);

    let langFilterID: '*' | Tag = $state('*');
    let langFilter = $derived(langFilterID === '*' ? null : langFilterID);
    //Media Changed and the langFilter is no longer valid.
    $effect(()=>{
        if(items.length>0 && !MediaLanguages.includes(langFilter)) langFilterID = '*';
    });

    /*
     * Multi Item Selection
     * CTRL + click = individual add to selected list
     * SHIFT + click = sequencial group add from last click
     * Drag = multiple select from first mousedown
     */

    let multipleSelectionFrom: number = -1;
    let multipleSelectionTo: number = -1;

    let multipleSelectionDragFrom: number = -1;
    let multipleSelectionDragTo: number = -1;
    let selectedDragItems: MediaContainer<MediaItem>[] = [];
    let contextItem: MediaContainer<MediaItem> = $state();
    
    /** Clears the item associated with the context menu. */
    function onContextMenuClose() {
        contextItem = null;
    }

    /** Resets item selection, drag state, and context-menu state. */
    function resetSelection() {
        multipleSelectionFrom = -1;
        multipleSelectionTo = -1;
        multipleSelectionDragFrom = -1;
        multipleSelectionDragTo = -1;
        selectedDragItems = [];
        selectedItems = [];
        contextItem = null;
    }
    /**
     * Creates a pointer handler for selecting an item or starting a drag selection.
     *
     * @param item - The item associated with the pointer event.
     * @returns A pointer event handler for the item.
     */
    const mouseHandler = (item: MediaContainer<MediaItem>) => (event: PointerEvent) => {
        event.stopPropagation();
        if (event.button === 2) {
            contextItem = item;
        }
        if (event.button === 0) {
            // left click
            switch (event.type) {
                case 'mousedown':
                    multipleSelectionDragFrom = filteredItems.indexOf(item);
                    multipleSelectionDragTo = -1;
                    selectedDragItems = [];
                    break;
                case 'mouseenter':
                    multipleSelectionDragTo = filteredItems.indexOf(item);
                    break;
                case 'mouseup':
                    multipleSelectionDragTo = filteredItems.indexOf(item);
                    onItemClick(event, item);
                    break;
            }
        }

        /**
         * Applies click, range, toggle, or drag selection to the current item.
         *
         * @param event - The pointer event that completed the selection.
         * @param item - The item selected by the event.
         */
        function onItemClick(
            event: PointerEvent,
            item: MediaContainer<MediaItem>,
        ) {
            if (multipleSelectionDragFrom !== multipleSelectionDragTo) {
                // multiple item
                filteredItems.forEach((item, index) => {
                    // Select all items between first and last drag
                    if (
                        (index >= multipleSelectionDragFrom &&
                            index <= multipleSelectionDragTo) ||
                        (index >= multipleSelectionDragTo &&
                            index <= multipleSelectionDragFrom)
                    )
                        selectedDragItems.push(item);
                });

                if (event.shiftKey || event.ctrlKey) {
                    // Merge & dedupe
                    selectedItems = [
                        ...new Set([...selectedItems, ...selectedDragItems]),
                    ];
                } else {
                    selectedItems = selectedDragItems;
                }
                selectedDragItems = [];
            } else {
                // click on item
                if (event.shiftKey) {
                    //range mode
                    if (multipleSelectionFrom === -1) {
                        multipleSelectionFrom = filteredItems.indexOf(item);
                        multipleSelectionTo = multipleSelectionFrom;
                        selectedItems = [item];
                    } else {
                        multipleSelectionTo = filteredItems.indexOf(item);
                        if (multipleSelectionFrom > multipleSelectionTo) {
                            const swap: number = multipleSelectionFrom;
                            multipleSelectionFrom = multipleSelectionTo;
                            multipleSelectionTo = swap;
                        }
                        selectedItems = filteredItems.slice(
                            multipleSelectionFrom,
                            multipleSelectionTo + 1,
                        );
                    }
                } else if (event.ctrlKey) {
                    //multiple mode
                    multipleSelectionFrom = filteredItems.indexOf(item);
                    multipleSelectionTo = -1;
                    if (selectedItems.includes(item))
                        selectedItems = selectedItems.filter(
                            (search) => search !== item,
                        );
                    else selectedItems = [...selectedItems, item];
                } else {
                    //single item
                    multipleSelectionFrom = filteredItems.indexOf(item);
                    multipleSelectionTo = multipleSelectionFrom;
                    selectedItems = [item];
                }
            }
        }
    };

    /**
     * Enqueues the supplied media items for download after obtaining directory access.
     *
     * @param items - The media items to enqueue.
     */
    async function downloadItems(items: MediaContainer<MediaItem>[]) {
        try {
            await HakuNeko.SettingsManager.OpenScope().Get<Directory>(GlobalKey.MediaDirectory).EnsureAccess();
        } catch(error) {
            // TODO: Use appropriate error visualization ...
            alert(error?.message ?? error);
            return;
        }
        items.forEach(item => window.HakuNeko.DownloadManager.Enqueue(item as StoreableMediaContainer<MediaItem>));
    }
    /**
     * Enqueues all items that have not been viewed or are not currently being viewed.
     *
     * @param items - The media items to filter and enqueue.
     */
    async function downloadUnviewedItems(items: MediaContainer<MediaItem>[]) {
        const unvieweditems = await items.reduce(async (accumP, current) => {
            const accum = await accumP;
            const flag = await window.HakuNeko.ItemflagManager.GetItemFlagType(current);
            if (flag !== FlagType.Viewed && flag !== FlagType.Current) {
                accum.push(current);
            }
            return accum;
        }, Promise.resolve([]));
        return downloadItems(unvieweditems);
    }

    /** Toggles the order in which the filtered items are displayed. */
    function reverseSort() {
        reverseSortOrder = !reverseSortOrder;
    }
</script>

{#if filteredItems.length > 0}
    <ContextMenu target={[itemsdiv]} onclose={onContextMenuClose}>
        {#if contextItem}
            <ContextMenuOption
                labelText="Download - {contextItem?.Title}"
                shortcutText="⌘D"
                onclick={() => downloadItems([contextItem])}
            />
        {/if}
        {#if selectedItems.length > 1}
            <ContextMenuOption
                labelText="Download {selectedItems.length} selecteds"
                shortcutText="⌘S"
                onclick={() => downloadItems(selectedItems.toReversed())}
            />
        {/if}
        <ContextMenuOption
            labelText="Download all"
            shortcutText="⌘A"
            onclick={() => downloadItems(filteredItems.toReversed())}
        />
        {#if contextItem}
            <ContextMenuDivider />
            <ContextMenuOption
                labelText="View"
                shortcutText="⌘V"
                onclick={() => {
                    UI.selectedItem = contextItem;
                }}
            />
            <ContextMenuOption labelText="Flag as">
                <ContextMenuOption
                    labelText="Not viewed"
                    onclick={async () => {
                        window.HakuNeko.ItemflagManager.UnflagItem(contextItem);
                    }}
                />
                <ContextMenuOption
                    labelText="Viewed"
                    onclick={async () => {
                        window.HakuNeko.ItemflagManager.FlagItem(
                            contextItem,
                            FlagType.Viewed,
                        );
                    }}
                />
                <ContextMenuOption
                    labelText="Current"
                    onclick={async () => {
                        window.HakuNeko.ItemflagManager.FlagItem(
                            contextItem,
                            FlagType.Current,
                        );
                    }}
                />
            </ContextMenuOption>
            <ContextMenuOption labelText="Copy">
                <ContextMenuGroup labelText="Copy options">
                    <ContextMenuOption
                        id="url"
                        labelText="URL"
                        shortcutText="⌘C"
                    />
                    <ContextMenuOption
                        id="name"
                        labelText="name"
                        shortcutText="⌘N"
                    />
                </ContextMenuGroup>
            </ContextMenuOption>
        {/if}
    </ContextMenu>
{/if}

<div id="Item" transition:fade>
    <div id="ItemTitle">
        <h5>Item List</h5>
    </div>
    <div id="LanguageFilter">
        <Button
            icon={EarthFilled}
            size="small"
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Languages"
        />

        <Dropdown
            disabled={MediaLanguages.length === 0}
            placeholder="Select a language"
            bind:selectedId={langFilterID}
            size="sm"
            items={langComboboxItems}
        />
    </div>
    <div id="ItemFilter">
        <Search id="ItemFilterSearch" size="sm" bind:value={itemNameFilter} />
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id="ItemList" class="list" bind:this={itemsdiv} onclick={resetSelection}>
        {#await loadItem}
            <div class="loading center">
                <div><Loading withOverlay={false} /></div>
                <div>... items</div>
            </div>
        {:then}
            {#each showItems as item (item)}
                <MediaComponent
                    {item}
                    multilang={!langFilter && MediaLanguages.length > 1}
                    selected={selectedItems.includes(item)}
                    hover={item === contextItem}
                    onView={(event) => onItemView(item)(event)}
                    onmousedown={mouseHandler(item)}
                    onmouseup={mouseHandler(item)}
                    onmouseenter={mouseHandler(item)}
                />
            {/each}
        {:catch error}
            <div class="error">
                <InlineNotification
                    lowContrast
                    title={`Plugin failed to load items`}
                >
                    <svelte:fragment slot="subtitleChildren">
                        {`${error.name} - ${error.message} `}
                        <p class="error-source">
                            Source: {UI.selectedMedia.Title} - {UI.selectedMedia?.Parent.Title}
                        </p>
                    </svelte:fragment>
                </InlineNotification>
            </div>
        {/await}
    </div>
    {#if items?.length > 0}
        <div id="DownloadButtons">
            {#if selectedItems.length > 0}
                <MenuButton labelText="Download" size="sm" intrinsicAlign="end">
                    {#if selectedItems.length === 1}
                        <MenuItem on:click={() => downloadItems(selectedItems)}>Selected (1)</MenuItem>
                    {:else }
                        <MenuItem on:click={() => downloadItems(selectedItems.toReversed())}>Selecteds ({selectedItems.length})</MenuItem>
                    {/if}
                    <MenuItem
                        on:click={() => downloadUnviewedItems(filteredItems.toReversed())}
                    >All unviewed</MenuItem>
                    <MenuItem on:click={() => downloadItems(filteredItems.toReversed())}>All</MenuItem>
                </MenuButton>
            {:else}
                <Button
                    size="small"
                    icon={CloudDownload}
                    iconDescription="Download all"
                    onclick={() => downloadUnviewedItems(filteredItems.toReversed())}
                >
                    Download all unviewed
                </Button>
            {/if}
        </div>
    {/if}
    <div id="ItemBottom">
        Items: {filteredItems.length}/{items.length}
        <Button
            size="small"
            kind="ghost"
            icon={ChevronSort}
            iconDescription="Reverse items sorting"
            onclick={reverseSort}
            style="float:right; padding:0; height:1.5em; min-height:1.5em">
        </Button>
    </div>
    <div 
        role="separator"
        aria-orientation="vertical"
        class="resize"
        use:resizeBar={{orientation:'vertical'}}
    ></div>
</div>

<style>
    #Item {
        display: grid;
        min-height: 0;
        height: 100%;
        grid-template-columns: 1fr 4px;
        grid-template-rows: 2.2em 2.2em 2.2em 1fr fit-content(2em) 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            'ItemTitle Nothing'
            'LanguageFilter Resize'
            'ItemFilter Resize'
            'ItemList Resize'
            'DownloadButtons Resize'
            'ItemBottom Resize';
        grid-area: Item;
        min-width: 22em;
    }
    #LanguageFilter {
        grid-area: LanguageFilter;
        display: grid;
        grid-template-columns: auto 1fr;
    }
    #ItemFilter {
        grid-area: ItemFilter;
    }
    #ItemList {
        grid-area: ItemList;
        background-color: var(--cds-field-01);
        overflow-x: hidden;
    }
    #ItemList .loading {
        width: 100%;
        height: 100%;
    }
    #ItemTitle {
        padding-top: 0.3em;
    }
    #ItemBottom {
        grid-area: ItemBottom;
        margin: 0.25em;
    }
    #DownloadButtons {
        grid-area: DownloadButtons;
        margin: 0.25em;
    }
    #DownloadButtons > :global(button) {
        width: 100%;
    }
    :global(#ItemList .list) {
        white-space: nowrap;
        list-style-type: none;
        padding: 0.25em;
    }
    .resize {
        grid-area: Resize;
        float:right;
        width:4px;
        cursor: col-resize;
    }
    .resize:hover {
            background-color:var(--cds-ui-02); 
    }
    .error-source {
        display: block;
        margin: 0.25em 0 0 auto;
        font-size: 0.7em;
        font-style: italic;
        color: var(--cds-text-03);
        text-align: right;
    }
</style>