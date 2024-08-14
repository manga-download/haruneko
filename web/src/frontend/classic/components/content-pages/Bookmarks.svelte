<script lang="ts">
    import { Tile, ClickableTile, Tag } from 'carbon-components-svelte';
    import { CaretRight } from 'carbon-icons-svelte';
    import { fade } from 'svelte/transition';
    import {
        selectedPlugin,
        selectedMedia,
        selectedItem,
    } from './../../stores/Stores';
    import MediaIcon from '../../../../img/media.webp';
    import type { Bookmark } from '../../../../engine/providers/Bookmark';

    //export let onlyNewContent = false;

    async function selectBookmark(bookmark: Bookmark) {
        $selectedPlugin = HakuNeko.BookmarkPlugin;
        $selectedMedia = bookmark;
        $selectedItem = undefined;
    }
</script>

<div id="bookmarkspage" in:fade>
    <Tile id="bookmarks" class="border">
        {#each window.HakuNeko.BookmarkPlugin.Entries.Value as bookmark (bookmark)}
            <ClickableTile
                class="suggesttile"
                light
                on:click={() => selectBookmark(bookmark)}
            >
                <div
                    class="mediaitem"
                    style="background-image: url({bookmark.Icon ?? MediaIcon});"
                >
                    <Tag class="suggesttitle" type="outline" interactive>
                        <span title={bookmark.Title}>{bookmark.Title}</span>
                    </Tag>

                    {#await bookmark.GetUnflaggedContent() then value}
                        {#if value.length > 0}
                            <Tag
                                class="suggestcount"
                                type="outline"
                                icon={CaretRight}
                                interactive
                            >
                                {value.length}
                            </Tag>
                        {/if}
                    {/await}
                </div>
            </ClickableTile>
        {/each}
    </Tile>
</div>

<style>
    #bookmarkspage {
        padding: 0.5em;
        height: 100%;
    }
    #bookmarkspage :global(#bookmarks) {
        margin-bottom: 1em;
        height: 100%;
    }

    #bookmarkspage :global(#bookmarks) {
        display: grid;
        grid-template-columns: repeat(auto-fit, 10em);
        grid-auto-rows: 10em;
        grid-gap: 0.5em;
        overflow: auto;
    }

    #bookmarkspage :global(#bookmarks .suggesttile) {
        padding: 0;
    }
    #bookmarkspage :global(#bookmarks .suggesttile .bx--tag span) {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #bookmarkspage :global(#bookmarks .suggesttitle) {
        width: 95%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #bookmarkspage :global(#bookmarks .suggestcount) {
        position: absolute;
        bottom: 0;
        right: 0.2em;
    }
    .mediaitem {
        height: 100%;
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>
