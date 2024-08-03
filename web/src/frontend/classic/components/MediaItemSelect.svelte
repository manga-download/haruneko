<script lang="ts">
    import {
        Button,
        Search,
        Dropdown,
        ContextMenu,
        ContextMenuDivider,
        ContextMenuGroup,
        ContextMenuOption,
        InlineNotification,
        Loading,
    } from 'carbon-components-svelte';
    import { EarthFilled } from 'carbon-icons-svelte';

    import { fade } from 'svelte/transition';

    import MediaComponent from './MediaItem.svelte';
    import {
        selectedMedia,
        selectedItem,
        selectedItemPrevious,
        selectedItemNext,
    } from '../stores/Stores';
    import { Tags, type Tag } from '../../../engine/Tags';
    const availableLanguageTags = Tags.Language.toArray();
    import { Locale } from '../stores/Settings';

    import type {
        StoreableMediaContainer,
        MediaItem,
    } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';

    let items: StoreableMediaContainer<MediaItem>[] = [];
    let filteredItems: StoreableMediaContainer<MediaItem>[] = [];
    let loadItem: Promise<void>;
    let selectedItems: StoreableMediaContainer<MediaItem>[] = [];

    selectedItem.subscribe((item: StoreableMediaContainer<MediaItem>) => {
        const position = filteredItems.indexOf(item);
        $selectedItemPrevious = filteredItems[position + 1];
        $selectedItemNext = filteredItems[position - 1];
    });

    const onItemView =
        (item: StoreableMediaContainer<MediaItem>) => (event) => {
            if (item === $selectedItem || event.ctrlKey || event.shiftKey)
                return;
            $selectedItem = item;
        };

    selectedMedia.subscribe(async (value) => {
        items = [];
        selectedItems = [];
        loadItem = value?.Update().then(() => {
            items = (value?.Entries.Value as StoreableMediaContainer<MediaItem>[]) ?? [];
        });
    });

    let itemNameFilter = '';
    $: filteredItems = items?.filter((item) => {
        let conditions: Boolean[] = [];
        if (itemNameFilter)
            conditions.push(
                item.Title.toLowerCase().indexOf(
                    itemNameFilter.toLowerCase(),
                ) !== -1,
            );
        if (langFilter) conditions.push(item.Tags.Value.includes(langFilter));
        return conditions.every((condition) => condition);
    });

    let itemsdiv: HTMLElement;

    let MediaLanguages: Tag[] = [];
    $: MediaLanguages = items.reduce((detectedLangaugeTags: Tag[], item) => {
        const undetectedLangaugeTags = item.Tags.Value.filter(tag => !detectedLangaugeTags.includes(tag) && availableLanguageTags.includes(tag));
        return [ ...detectedLangaugeTags, ...undetectedLangaugeTags ];
    }, []);
    $: langComboboxItems =
        MediaLanguages.length > 0
            ? [
                  { id: '*', text: '*' },
                  ...MediaLanguages.map((lang) => {
                      return { id: lang, text: $Locale[lang.Title]() };
                  }),
              ]
            : [{ id: '*', text: '*' }];

    let langFilterID: '*' | Tag = '*';
    $: langFilter = langFilterID === '*' ? null : langFilterID;
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
    let selectedDragItems: StoreableMediaContainer<MediaItem>[] = [];
    let contextItem: StoreableMediaContainer<MediaItem>;
    let contextMenuOpen;

    $: if (!contextMenuOpen) contextItem = null;

    const mouseHandler =
        (item: StoreableMediaContainer<MediaItem>) => (event: any) => {
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

            function onItemClick(
                event: MouseEvent,
                item: StoreableMediaContainer<MediaItem>,
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
                            ...new Set([
                                ...selectedItems,
                                ...selectedDragItems,
                            ]),
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

    function downloadItems(items: StoreableMediaContainer<MediaItem>[]) {
        items.forEach((item) => {
            window.HakuNeko.DownloadManager.Enqueue(item);
        });
    }
</script>

{#if filteredItems.length > 0}
    <ContextMenu bind:open={contextMenuOpen} target={[itemsdiv]}>
        {#if contextItem}
            <ContextMenuOption
                labelText="Download - {contextItem?.Title}"
                shortcutText="⌘D"
                on:click={() => downloadItems([contextItem])}
            />
        {/if}
        {#if selectedItems.length > 1}
            <ContextMenuOption
                labelText="Download {selectedItems.length} selecteds"
                shortcutText="⌘S"
                on:click={() => downloadItems(selectedItems)}
            />
        {/if}
        <ContextMenuOption
            labelText="Download all"
            shortcutText="⌘A"
            on:click={() => downloadItems(filteredItems)}
        />
        {#if contextItem}
            <ContextMenuDivider />
            <ContextMenuOption
                labelText="View"
                shortcutText="⌘V"
                on:click={() => {
                    $selectedItem = contextItem;
                }}
            />
            <ContextMenuOption labelText="Flag as">
                <ContextMenuOption
                    labelText="Not viewed"
                    on:click={async () => {
                        window.HakuNeko.ItemflagManager.UnflagItem(contextItem);
                    }}
                />
                <ContextMenuOption
                    labelText="Viewed"
                    on:click={async () => {
                        window.HakuNeko.ItemflagManager.FlagItem(
                            contextItem,
                            FlagType.Viewed,
                        );
                    }}
                />
                <ContextMenuOption
                    labelText="Current"
                    on:click={async () => {
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
        <Search size="sm" bind:value={itemNameFilter} />
    </div>
    <div id="ItemList" class="list" bind:this={itemsdiv}>
        {#await loadItem}
            <div class="loading center">
                <div><Loading withOverlay={false} /></div>
                <div>... items</div>
            </div>
        {:then}
            {#each filteredItems as item (item)}
                <MediaComponent
                    {item}
                    multilang={!langFilter && MediaLanguages.length > 1}
                    selected={selectedItems.includes(item)}
                    hover={item === contextItem}
                    on:view={(event) => onItemView(item)(event.detail)}
                    on:mousedown={mouseHandler(item)}
                    on:mouseup={mouseHandler(item)}
                    on:mouseenter={mouseHandler(item)}
                />
            {/each}
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
    <div id="ItemCount">
        Items: {filteredItems.length}/{items.length}
    </div>
</div>

<style>
    #Item {
        display: grid;
        min-height: 0;
        height: 100%;
        grid-template-rows: 2.2em 2.2em 2.2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            'ItemTitle'
            'LanguageFilter'
            'ItemFilter'
            'ItemList'
            'ItemCount';
        grid-area: Item;
        overflow-x: hidden;
        resize: horizontal;
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
        box-shadow: inset 0 0 0.2em 0.2em var(--cds-ui-background);
        overflow-x: hidden;
    }
    #ItemList .loading {
        width: 100%;
        height: 100%;
    }
    #ItemTitle {
        padding-top: 0.3em;
    }
    #ItemCount {
        grid-area: ItemCount;
        margin: 0.25em;
    }
    :global(#ItemList .list) {
        white-space: nowrap;
        list-style-type: none;
        padding: 0.25em;
    }
</style>
