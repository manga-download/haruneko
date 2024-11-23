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
        Search,
    } from 'carbon-components-svelte';
    import { ChevronSort, EarthFilled } from 'carbon-icons-svelte';

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
        MediaContainer,
        MediaChild,
    } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';
    import { resizeBar } from '../lib/actions';

    let items: MediaContainer<MediaItem>[] = $state([]);
    let filteredItems: MediaContainer<MediaItem>[] = $state([]);
    let selectedItems: MediaContainer<MediaItem>[] = $state([]);
    let reverseSortOrder: boolean = $state(false);

    let loadItem: Promise<MediaContainer<MediaChild>> = $state();
    loadItem = updateMedia($selectedMedia);
    selectedMedia.subscribe(() => loadItem = updateMedia($selectedMedia)) ;

    async function updateMedia(
        media: MediaContainer<MediaChild>,
    ): Promise<MediaContainer<MediaChild>> {
        items = [];
        selectedItems = [];
        if (media) {
            await media?.Update();
            items = media?.Entries.Value as MediaContainer<MediaItem>[];
        }
        return media;
    }

    selectedItem.subscribe((item: MediaContainer<MediaItem>) => {
        const position = filteredItems.indexOf(item);
        $selectedItemPrevious = filteredItems[position + 1];
        $selectedItemNext = filteredItems[position - 1];
    });

    const onItemView = (item: MediaContainer<MediaItem>) => (event) => {
        if (item === $selectedItem || event.ctrlKey || event.shiftKey) return;
        $selectedItem = item;
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
                      return { id: lang, text: $Locale[lang.Title]() };
                  }),
              ]
            : [{ id: '*', text: '*' }]);

    let langFilterID: '*' | Tag = $state('*');
    let langFilter = $derived(langFilterID === '*' ? null : langFilterID);

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
    let contextMenuOpen = $state(false);
    $effect(() => {
        if (!contextMenuOpen) contextItem = null;
    });

    const mouseHandler = (item: MediaContainer<MediaItem>) => (event: any) => {
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

    function downloadItems(items: MediaContainer<MediaItem>[]) {
        items.forEach((item) => {
            window.HakuNeko.DownloadManager.Enqueue(
                item as StoreableMediaContainer<MediaItem>,
            );
        });
    }

    function reverseSort() {
        reverseSortOrder = !reverseSortOrder;
    }
</script>

{#if filteredItems.length > 0}
    <ContextMenu bind:open={contextMenuOpen} target={[itemsdiv]}>
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
                onclick={() => downloadItems(selectedItems)}
            />
        {/if}
        <ContextMenuOption
            labelText="Download all"
            shortcutText="⌘A"
            onclick={() => downloadItems(filteredItems)}
        />
        {#if contextItem}
            <ContextMenuDivider />
            <ContextMenuOption
                labelText="View"
                shortcutText="⌘V"
                onclick={() => {
                    $selectedItem = contextItem;
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
    <div id="ItemList" class="list" bind:this={itemsdiv}>
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
                    onView={(event) => onItemView(item)(event.detail)}
                    onmousedown={mouseHandler(item)}
                    onmouseup={mouseHandler(item)}
                    onmouseenter={mouseHandler(item)}
                />
            {/each}
        {:catch error}
            <div class="error">
                <InlineNotification
                    lowContrast
                    title={error.name}
                    subtitle={error.message}
                />
            </div>
        {/await}
    </div>
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
        grid-template-rows: 2.2em 2.2em 2.2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            'ItemTitle Nothing'
            'LanguageFilter Resize'
            'ItemFilter Resize'
            'ItemList Resize'
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
</style>
