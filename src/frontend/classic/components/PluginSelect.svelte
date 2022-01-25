<script lang="ts">
    import {
        Button,
        Tile,
        Modal,
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
    } from "carbon-components-svelte";
    import PlayFilledAlt24 from "carbon-icons-svelte/lib/PlayFilledAlt24";
    import ArrowUpRight24 from "carbon-icons-svelte/lib/ArrowUpRight24";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import { createEventDispatcher } from "svelte";

    import Chip from "./Tag.svelte";
    import type { Tag } from '../../../engine/Tags';
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    function createDataRow(item: IMediaContainer) {
        return {
            id: item.Identifier,
            name: item.Title,
            mediaContainer: item
        };
    }

    const dispatch = createEventDispatcher();
    export let pluginlist: Array<IMediaContainer>;
    export let isPluginModalOpen = false;

    //quickly inline because of dangerous lazyness
    let pluginsHeaders = [
        { key: "image", empty: true },
        { key: "name", value: "Name" },
        { key: "tags", value: "Tags" },
        { key: "overflow", empty: true },
    ];

    //because hardccoding values is da way (Do You Know Da Wae?)
    //will fuse in a single main array with dispatch
    const langTags = HakuNeko.Tags.Language.toArray();
    const typeTags = HakuNeko.Tags.Media.toArray();
    const otherTags = [ ...HakuNeko.Tags.Source.toArray(), ...HakuNeko.Tags.Rating.toArray() ];

    let pluginNameFilter = "";
    let pluginTagsFilter: Tag[] = [];

    function addTagFilter(tag: Tag) {
        if(!pluginTagsFilter.includes(tag)) {
            pluginTagsFilter = [...pluginTagsFilter, tag];
        }
    }
    function removeTagFilter(tag: Tag) {
        pluginTagsFilter = pluginTagsFilter.filter(value => tag !== value);
    }
    addTagFilter(HakuNeko.Tags.Language.French);

    $: filteredPluginlist = pluginlist
        .filter((item) => {
            let conditions: Array<boolean> = [];
            if (pluginNameFilter !== "") {
                conditions.push(
                    item.Title.toLowerCase().indexOf(
                        pluginNameFilter.toLowerCase()
                    ) !== -1
                );
            }
            if (pluginTagsFilter.length > 0) {
                // Quick test tag filtering using language property
                // Should be a test if all selected tags are in the tags of plugin
                conditions.push(
                    true
                    /* TODO: resurect language tags later
                item. !== undefined
                    ? pluginTagsFilter.find(
                        (element) => element.label === item.Language
                    ) !== undefined
                    : true
                */
                );
            }
            return !conditions.includes(false);
        })
        .map(item => createDataRow(item));
</script>

<Modal
    id="pluginModal"
    size="lg"
    hasScrollingContent
    bind:open={isPluginModalOpen}
    passiveModal
    modalHeading="Plugin Selection"
    on:click:button--secondary={() => (isPluginModalOpen = false)}
    on:open
    on:close
    hasForm
>
    <div class="content tags">
        <Tile>
            <div class="lang">
                <div>{HakuNeko.Tags.Language}</div>
                {#each langTags as item}
                    <Chip
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="type">
                <div>{HakuNeko.Tags.Media}</div>
                {#each typeTags as item}
                    <Chip
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="other">
                <div>Other</div>
                {#each otherTags as item}
                    <Chip
                        category={item.Category}
                        label={item.Title}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
        </Tile>
    </div>
    <Tile id="selectedTags">
        <span>Tags:</span>
        {#each pluginTagsFilter as item}
            <Chip
                filter
                category={item.Category}
                label={item.toString('%C: %T')}
                on:click={() => removeTagFilter(item)}
            />
        {/each}
    </Tile>
    <DataTable
        zebra
        bind:headers={pluginsHeaders}
        bind:rows={filteredPluginlist}
        on:click:row={(event) =>
            dispatch("select", event.detail.mediaContainer)}
    >
        <Toolbar>
            <ToolbarContent>
                <ToolbarSearch
                    persistent
                    expanded
                    bind:value={pluginNameFilter}
                />
            </ToolbarContent>
        </Toolbar>
        <div class="plugin-row" slot="cell" let:cell>
            {#if cell.key === "image"}
                <Image16 />
            {:else if cell.key === "overflow"}
                <div class=" action-cell">
                    <Button
                        kind="ghost"
                        size="small"
                        tooltipPosition="bottom"
                        tooltipAlignment="center"
                        icon={PlayFilledAlt24}
                        on:click={(e) => {
                            alert("Run test");
                            e.stopPropagation();
                        }}
                    >
                        Run Test
                    </Button>
                    <Button
                        size="small"
                        kind="ghost"
                        icon={ArrowUpRight24}
                        iconDescription="Open link"
                    />
                </div>
            {:else}{cell.value}{/if}
        </div>
    </DataTable>
</Modal>

<style>
    :global(#selectedTags) {
        padding: 1rem 1rem 0 0;
    }
    .action-cell {
        text-align: right;
    }
    .plugin-row {
        cursor: pointer;
    }
    :global(#pluginModal .bx--modal-content) {
        margin-bottom: 0;
    }

    .content {
        text-align: center;
        /* overflow-y: scroll; */
        /* overflow-x: hidden; */
    }
    .tags {
        width: 100%;
    }
    .lang {
        display: inline-block;
        width: 33%;
    }
    .type {
        display: inline-block;
        width: 33%;
    }
    .other {
        display: inline-block;
        width: 33%;
    }
</style>
