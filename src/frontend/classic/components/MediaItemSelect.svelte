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
    } from "carbon-components-svelte";
    import { EarthFilled } from "carbon-icons-svelte";

    import { fade } from "svelte/transition";

    import MediaItem from "./MediaItem.svelte";
    import { selectedMedia, selectedItem } from '../Stores';

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    

    let items: IMediaContainer[] = [];
    let filteredItems: IMediaContainer[] = [];

    let loadItem: Promise<void>; 
    let selectedItems: IMediaContainer[] = [];
    let multipleSelectionFrom: number = -1;
    let multipleSelectionTo: number = -1;

    async function onItemClick(item: IMediaContainer, event: any) {
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
    }

    selectedMedia.subscribe(value => {
        items = [];
        selectedItems = [];
        loadItem = value?.Update().then(() => {
            items = (value?.Entries as IMediaContainer[]) ?? [];
        });
    });

    let itemNameFilter = "";
    $: filteredItems = items?.filter((item) => {
        return (
            item.Parent?.Title.toLowerCase().indexOf(
                itemNameFilter.toLowerCase()
            ) !== -1
        );
    });

    let itemsdiv: HTMLElement;
</script>

<ContextMenu target={itemsdiv}>
    {#if selectedItems.length > 1}
        <ContextMenuOption indented labelText="Download selecteds" />
    {:else}
        <ContextMenuOption indented labelText="Download" shortcutText="⌘D" />
        <ContextMenuOption indented labelText="View" shortcutText="⌘V" />
    {/if}
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Copy">
        <ContextMenuGroup labelText="Copy options">
            <ContextMenuOption id="url" labelText="URL" shortcutText="⌘C" />
            <ContextMenuOption id="name" labelText="name" shortcutText="⌘N" />
        </ContextMenuGroup>
    </ContextMenuOption>
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Bookmark" shortcutText="⌘B" />
</ContextMenu>

<div id="Item" transition:fade>
    <div id="ItemTitle">
        <h5 class="separator">Item List</h5>
    </div>
    <div id="LanguageFilter">
        <div class="inline">
            <Button
                icon={EarthFilled}
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Languages"
            />
        </div>
        <div class="inline-wide">
            <Dropdown
                selectedId="0"
                size="sm"
                items={[
                    { id: "0", text: "*" },
                    { id: "1", text: "gb" },
                    { id: "2", text: "fr" },
                ]}
            />
        </div>
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
            {#each filteredItems as item}
                <MediaItem
                    {item}
                    selected={selectedItems.includes(item)}
                    on:view={(e) => {
                        selectedItems.push(e.detail);
                        $selectedItem=e.detail;
                    }}
                    on:click={(e) => onItemClick(item, e)}
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
        grid-template-rows: 2em 2em 2em 1fr 2em;
        gap: 0.3em 0.3em;
        grid-template-areas:
            "ItemTitle"
            "LanguageFilter"
            "ItemFilter"
            "ItemList"
            "ItemCount";
        grid-area: Item;
    }
    #LanguageFilter {
        grid-area: LanguageFilter;
        display: table;
    }
    #ItemFilter {
        grid-area: ItemFilter;
        display: table;
    }
    #ItemList {
        grid-area: ItemList;
        background-color: var(--cds-field-01);
        overflow-y: scroll;
        overflow-x: hidden;
    }
    #ItemList .loading {
        width:100%;
        height:100%;
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
    .separator {
        border-bottom: 1px groove var(--cds-button-separator);
    }

    .inline {
        width: fit-content;
    }
    .inline-wide {
        display: table-cell;
        width: 100%;
    }
</style>
