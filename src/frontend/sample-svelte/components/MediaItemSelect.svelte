<script lang="ts">
    import {
        Button,
        Search,
        Dropdown,
        InlineLoading,
    } from "carbon-components-svelte";
    import EarthFilled16 from "carbon-icons-svelte/lib/EarthFilled16";

    import { fade } from "svelte/transition";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import MediaItem from "./MediaItem.svelte";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    let items: IMediaContainer[] = [];
    let filteredItems: IMediaContainer[] = [];

    export let media: IMediaContainer | null;
    let selectedItem: IMediaContainer | null;

    //On: MangaChange
    $: {
        media?.Update().then(() => {
            items = (media?.Entries as IMediaContainer[]) ?? [];
            selectedItem = null;
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
</script>

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
    <div id="ItemList" class="list">
        {#await items}
            <InlineLoading status="active" description="Working..." />
        {:then items}
            {#each filteredItems as item, i}
                <MediaItem
                    {item}
                    selected={selectedItem === item}
                    on:view={(e) => {
                        selectedItem = e.detail;
                        dispatch("view", selectedItem);
                    }}
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
