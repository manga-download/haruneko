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

    import Tag from "./Tag.svelte";
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    interface ITag {
        category: string;
        label: string;
    }

    class PluginRow {
        id: string;
        name: string;
        mediaContainer: IMediaContainer;

        constructor(item: IMediaContainer) {
            this.id = item.Identifier;
            this.name = item.Title;
            this.mediaContainer = item;
        }
    }

    const dispatch = createEventDispatcher();
    export let pluginlist: Array<IMediaContainer>;
    export let myPluginModalOpen = false;

    //quickly inline because of dangerous lazyness
    let pluginsHeaders = [
        { key: "image", empty: true },
        { key: "name", value: "Name" },
        { key: "tags", value: "Tags" },
        { key: "overflow", empty: true },
    ];

    //because hardccoding values is da way (Do You Know Da Wae?)
    //will fuse in a single main array with dispatch
    const langTags: Array<ITag> = [
        { category: "lang", label: "English" },
        { category: "lang", label: "French" },
        { category: "lang", label: "multi-lingual" },
    ];
    const typeTags: Array<ITag> = [
        { category: "type", label: "Anime" },
        { category: "type", label: "Manga" },
        { category: "type", label: "Novel" },
        { category: "type", label: "Webtoon" },
    ];
    const otherTags: Array<ITag> = [
        { category: "lang", label: "porn" },
        { category: "lang", label: "raw" },
        { category: "lang", label: "scanlation" },
        { category: "lang", label: "subbed" },
    ];

    let pluginNameFilter = "";
    let pluginTagsFilter: Array<ITag> = [];

    function addTagFilter(tag: ITag) {
        //todo: check for duplicate
        pluginTagsFilter = [...pluginTagsFilter, tag];
    }
    function removeTagFilter(tag: ITag) {
        pluginTagsFilter = pluginTagsFilter.filter(function (
            value: any,
            index,
            arr
        ) {
            return tag !== value;
        });
    }
    addTagFilter({ category: "lang", label: "French" });

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
        .map((item) => new PluginRow(item));
</script>

<Modal
    size="lg"
    bind:open={myPluginModalOpen}
    passiveModal
    modalHeading="Plugin Selection"
    on:click:button--secondary={() => (myPluginModalOpen = false)}
    on:open
    on:close
    hasScrollingContent
    hasForm
    id="pluginModal"
>
    <div class="content tags">
        <Tile>
            <div class="lang">
                <div>Language</div>
                {#each langTags as item}
                    <Tag
                        category={item.category}
                        label={item.label}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="type">
                <div>Type</div>
                {#each typeTags as item}
                    <Tag
                        category={item.category}
                        label={item.label}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
            <div class="other">
                <div>Other</div>
                {#each otherTags as item}
                    <Tag
                        category={item.category}
                        label={item.label}
                        on:click={() => addTagFilter(item)}
                    />
                {/each}
            </div>
        </Tile>
    </div>
    <Tile id="selectedTags">
        <span>Tags:</span>
        {#each pluginTagsFilter as item}
            <Tag
                filter
                category={item.category}
                label={item.label}
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
        <div class="plugin-row" slot="cell" let:cell let:row>
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
