<script lang="ts">
    import {
        Button,
        Search,
        Dropdown,
        InlineLoading,
        ContextMenu,
        ContextMenuDivider,
        ContextMenuGroup,
        ContextMenuOption,
    } from "carbon-components-svelte";
    import EarthFilled16 from "carbon-icons-svelte/lib/EarthFilled16";

    import { fade } from "svelte/transition";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import MediaItem from "./MediaItem.svelte";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    let items: IMediaContainer[] = [];
    let filteredItems: IMediaContainer[] = [];

    export let media: IMediaContainer | undefined;
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
            const positionInSelectedItems = selectedItems.indexOf(item);
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

    //On: MangaChange
    $: {
        media?.Update().then(() => {
            items = (media?.Entries as IMediaContainer[]) ?? [];
            selectedItems = [];
        });
    }

    let itemNameFilter = "";
    $: filteredItems = items?.filter((item) => {
        return (
            item.Parent?.Title.toLowerCase().indexOf(
                itemNameFilter.toLowerCase()
            ) !== -1
        );
    });

    // Context Menu
    let itemsdiv: HTMLElement;
    let pos = { x: 0, y: 0 };
    let showMenu = false;

    async function onRightClick(event: any) {
        if (showMenu) {
            showMenu = false;
            await new Promise((res) => setTimeout(res, 100));
        }
        pos = { x: event.clientX, y: event.clientY };
        showMenu = true;
    }

    document.addEventListener(
        "contextmenu",
        function (event: any) {
            if (event.target === itemsdiv || itemsdiv.contains(event.target)) {
                event.preventDefault();
                return;
            }
            showMenu = false;
        },
        true
    );
</script>

{#if showMenu}
    <ContextMenu open={showMenu} x={pos.x} y={pos.y}>
        {#if selectedItems.length > 1}
            <ContextMenuOption indented labelText="Download selecteds" />
        {:else}
            <ContextMenuOption
                indented
                labelText="Download"
                shortcutText="⌘D"
            />
            <ContextMenuOption indented labelText="View" shortcutText="⌘V" />
        {/if}
        <ContextMenuDivider />
        <ContextMenuOption indented labelText="Copy">
            <ContextMenuGroup labelText="Copy options">
                <ContextMenuOption id="url" labelText="URL" shortcutText="⌘C" />
                <ContextMenuOption
                    id="name"
                    labelText="name"
                    shortcutText="⌘N"
                />
            </ContextMenuGroup>
        </ContextMenuOption>
        <ContextMenuDivider />
        <ContextMenuOption indented labelText="Bookmark" shortcutText="⌘B" />
    </ContextMenu>
{/if}

<div id="Item" transition:fade>
    <div id="ItemTitle">
        <h5 class="separator">Item List</h5>
    </div>
    <div id="LanguageFilter">
        <div class="inline">
            <Button
                icon={EarthFilled16}
                hasIconOnly
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Languages"
            />
        </div>
        <div class="inline-wide">
            <Dropdown
                selectedIndex={0}
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
        {#await items}
            <InlineLoading status="active" description="Working..." />
        {:then items}
            {#each filteredItems as item, i}
                <MediaItem
                    {item}
                    selected={selectedItems.includes(item)}
                    on:view={(e) => {
                        selectedItems.push(e.detail);
                        dispatch("view", item);
                    }}
                    on:click={(e) => onItemClick(item, e)}
                    on:contextmenu={onRightClick}
                />
            {/each}
        {:catch error}
            <p style="color: red">{error}</p>
        {/await}
    </div>
    <div id="ItemCount">
        {#await items}
            Items: ?
        {:then items}
            Items: {filteredItems.length}/{items.length}
        {:catch error}
            Items: ?
        {/await}
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
