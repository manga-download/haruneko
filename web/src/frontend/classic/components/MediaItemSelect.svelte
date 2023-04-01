<script lang="ts">
    import {
        Button,
        Search,
        Dropdown,
        ContextMenu,
        ContextMenuDivider,
        ContextMenuGroup,
        ContextMenuOption,
        Loading,
    } from 'carbon-components-svelte';
    import { EarthFilled } from 'carbon-icons-svelte';

    import { fade } from 'svelte/transition';

    import MediaItem from './MediaItem.svelte';
    import {
        selectedMedia,
        selectedItem,
        selectedItemPrevious,
        selectedItemNext,
    } from '../stores/Stores';

    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import { FlagType } from '../../../engine/ItemflagManager';

    let items: IMediaContainer[] = [];
    let filteredItems: IMediaContainer[] = [];
    let loadItem: Promise<void>;
    let selectedItems: IMediaContainer[] = [];

    selectedItem.subscribe((item: IMediaContainer) => {
        const position = filteredItems.indexOf(item);
        $selectedItemPrevious = filteredItems[position + 1];
        $selectedItemNext = filteredItems[position - 1];
    });

    const onItemView = (item: IMediaContainer) => (_event: any) => {
        selectedItems.push(item);
        $selectedItem = item;
    };

    selectedMedia.subscribe(async (value) => {
        items = [];
        selectedItems = [];
        loadItem = value?.Update().then(() => {
            items = (value?.Entries as IMediaContainer[]) ?? [];
        });
    });

    let itemNameFilter = '';
    $: filteredItems = items?.filter((item) => {
        return (
            item.Parent?.Title.toLowerCase().indexOf(
                itemNameFilter.toLowerCase()
            ) !== -1
        );
    });

    let itemsdiv: HTMLElement;

    /*
     * Multi Item Selection
     * CTRL + click = individual add to selected list
     * SHIFT + click = sequencial group add from last click
     * Drag = multiple select from first mousedown
     */

    let multipleSelectionFrom: number = -1;
    let multipleSelectionTo: number = -1;

    const onItemClick = (item: IMediaContainer) => (event: any) => {
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
                    multipleSelectionTo + 1
                );
            }
        } else if (event.ctrlKey) {
            //multiple mode
            multipleSelectionFrom = filteredItems.indexOf(item);
            multipleSelectionTo = -1;
            //const positionInSelectedItems = selectedItems.indexOf(item);
            if (selectedItems.includes(item))
                selectedItems = selectedItems.filter(
                    (search) => search !== item
                );
            else selectedItems = [...selectedItems, item];
        } else {
            //single item
            multipleSelectionFrom = filteredItems.indexOf(item);
            multipleSelectionTo = multipleSelectionFrom;
            selectedItems = [item];
        }
    };

    let multipleSelectionDragFrom: number = -1;
    let multipleSelectionDragTo: number = -1;
    let selectedDragItems: IMediaContainer[] = [];

    const mouseHandler = (item: IMediaContainer) => (event: any) => {
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
                if (multipleSelectionDragFrom === multipleSelectionDragTo) {
                    onItemClick(item)(event);
                } else {
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
                }
                break;
        }
    };
</script>

<ContextMenu target={[itemsdiv]}>
    {#if selectedItems.length > 1}
        <ContextMenuOption indented labelText="Download selecteds" />
    {:else}
        <ContextMenuOption indented labelText="Download" shortcutText="⌘D" />
        <ContextMenuOption
            indented
            labelText="View"
            shortcutText="⌘V"
            on:click={() => {
                $selectedItem = selectedItems[0];
            }}
        />
        <ContextMenuOption indented labelText="Flag as">
            <ContextMenuOption
                indented
                labelText="Not viewed"
                on:click={async () => {
                    window.HakuNeko.ItemflagManager.UnflagItem(
                        selectedItems[0]
                    );
                }}
            />
            <ContextMenuOption
                indented
                labelText="Viewed"
                on:click={async () => {
                    window.HakuNeko.ItemflagManager.FlagItem(
                        selectedItems[0],
                        FlagType.Viewed
                    );
                }}
            />
            <ContextMenuOption
                indented
                labelText="Current"
                on:click={async () => {
                    window.HakuNeko.ItemflagManager.FlagItem(
                        selectedItems[0],
                        FlagType.Current
                    );
                }}
            />
        </ContextMenuOption>
    {/if}
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Copy">
        <ContextMenuGroup labelText="Copy options">
            <ContextMenuOption id="url" labelText="URL" shortcutText="⌘C" />
            <ContextMenuOption id="name" labelText="name" shortcutText="⌘N" />
        </ContextMenuGroup>
    </ContextMenuOption>
    <ContextMenuDivider />
</ContextMenu>

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
            selectedId="0"
            size="sm"
            items={[
                { id: '0', text: '*' },
                { id: '1', text: 'gb' },
                { id: '2', text: 'fr' },
            ]}
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
            {#each filteredItems as item (item.Identifier)}
                <MediaItem
                    {item}
                    selected={selectedItems.includes(item)}
                    on:view={onItemView(item)}
                    on:contextmenu={onItemClick(item)}
                    on:mousedown={mouseHandler(item)}
                    on:mouseup={mouseHandler(item)}
                    on:mouseenter={mouseHandler(item)}
                />
            {/each}
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
        min-width: 19em;
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
