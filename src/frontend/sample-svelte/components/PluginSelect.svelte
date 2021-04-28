<script lang="ts">
    import { Accordion, Tile, Search, Modal } from "carbon-components-svelte";
    import Tag from "./Tag.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import Plugin from "./Plugin.svelte";

    export let pluginlist: Array<IMediaContainer>;
    export let myPluginModalOpen = false;

    //quickly inline because of dangerous lazyness
    interface ITag {
        category: string;
        label: string;
    }

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

    let filteredpluginlist: Array<IMediaContainer> = pluginlist;
    $: filteredPluginlist = pluginlist.filter((item) => {
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
    });
</script>


<Modal
    size="lg"
    bind:open={myPluginModalOpen}
    passiveModal
    modalHeading="Plugin Selection"
    on:click:button--secondary={() => (myPluginModalOpen = false)}
    on:open
    on:close
>
<div class="content">
    <div class="tags">
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
    <div class="search">
        <div class="filter">
            <Search
                bind:value={pluginNameFilter}
                placeholder="Search plugin by name ..."
                size="sm"
            />
        </div>
        <div class="selectedtags">
            <Tile light>
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
        </div>
    </div>
    <Tile>
        <Accordion align="start" size="sm">
            {#each filteredPluginlist as item}
                <Plugin plugin={item} display="AccordionItem" on:select />
            {/each}
        </Accordion>
    </Tile>
</div>
</Modal>

<style>
    .content {
        text-align: center;
        overflow-y: scroll;
        overflow-x: hidden;
        /* height: calc(100vh - 7.5em); */
    }
    .topleft {
        position: relative;
        display: flex;
        align-items: center;
    }
    .close {
        display: inline-block;
    }
    .title {
        display: inline-block;
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
    .filter {
        display: inline-block;
    }
    .selectedtags {
        display: inline-block;
    }
</style>
