<script lang="ts">
    import { fade } from 'svelte/transition';
    import {
        ContextMenu,
        ContextMenuDivider,
        ContextMenuOption,
    } from 'carbon-components-svelte';
    import { selectedMedia } from '../Stores';

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    export let media: IMediaContainer;
    export let selected: Boolean;
    let isBookmarked: Boolean = HakuNeko.BookmarkPlugin.isBookmarked(media);
    let mediadiv: HTMLElement;
    async function toggleBookmark(){
        isBookmarked = await window.HakuNeko.BookmarkPlugin.Toggle(media);
    }
</script>
<ContextMenu target={mediadiv}>
    <ContextMenuOption indented labelText="Browse Chapters" shortcutText="⌘B" />
    <ContextMenuOption indented labelText={isBookmarked ?"Remove from Bookmarks" :"Add to Bookmarks"} shortcutText="⌘F" on:click={toggleBookmark}/>
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Trackers">
        <!--{#each window.HakuNeko.PluginController.InfoTrackers as tracker}
            <ContextMenuOption labelText="{tracker.Title}" on:click={() => {selectedTracker=tracker; isTrackerModalOpen=true;}} />
        {/each}
            -->
    </ContextMenuOption>
    <ContextMenuDivider />
</ContextMenu>
<div bind:this={mediadiv} class="media" in:fade class:selected on:click={() => $selectedMedia = media}>
    {#if isBookmarked}<span transition:fade>⭐</span>{/if}{media.Title}
</div>

<style>
    .media {
        padding-top: 2px;
        padding-bottom: 2px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .media:hover {
        background-color: var(--cds-hover-ui);
    }
    .media.selected {
        background-color: var(--cds-active-ui);
    }
</style>
