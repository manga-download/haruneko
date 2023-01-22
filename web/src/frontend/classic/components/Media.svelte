<script lang="ts">
    import { fade } from 'svelte/transition';
    import {
        ContextMenu,
        ContextMenuDivider,
        ContextMenuOption,
    } from 'carbon-components-svelte';
    import { PlayFilled } from 'carbon-icons-svelte';
    import { selectedMedia } from '../stores/Stores';

    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';

    export let media: IMediaContainer;
    let selected: Boolean = false;
    $: selected = $selectedMedia === media;
    let isBookmarked: Boolean = HakuNeko.BookmarkPlugin.isBookmarked(media);
    let mediadiv: HTMLElement;
    async function toggleBookmark() {
        isBookmarked = await window.HakuNeko.BookmarkPlugin.Toggle(media);
    }

    //Check if media has unviewed content
    let unFlaggedItems: IMediaContainer[] = [];
    findMediaUnFlaggedContent(media);

    import { EventWatcher } from '../stores/Events';
    const mediaFlagsChanged = EventWatcher(
        null,
        HakuNeko.ItemflagManager.MediaFlagsChanged,
        media
    );
    $: if ($mediaFlagsChanged) findMediaUnFlaggedContent(media);

    async function findMediaUnFlaggedContent(media: IMediaContainer) {
        unFlaggedItems = await HakuNeko.ItemflagManager.GetUnFlaggedItems(
            media
        );
    }
</script>

<ContextMenu target={[mediadiv]}>
    <ContextMenuOption indented labelText="Browse Chapters" shortcutText="⌘B" />
    <ContextMenuOption
        indented
        labelText={isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks'}
        shortcutText="⌘F"
        on:click={toggleBookmark}
    />
    <ContextMenuDivider />
    <ContextMenuOption indented labelText="Trackers">
        <!--{#each window.HakuNeko.PluginController.InfoTrackers as tracker}
            <ContextMenuOption labelText="{tracker.Title}" on:click={() => {selectedTracker=tracker; isTrackerModalOpen=true;}} />
        {/each}
            -->
    </ContextMenuOption>
    <ContextMenuDivider />
</ContextMenu>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    bind:this={mediadiv}
    class="media"
    in:fade
    class:selected
    on:click={() => ($selectedMedia = media)}
>
    {#if isBookmarked}<span transition:fade class="bookmark">⭐</span>{/if}
    <span title={media.Title} class="title">{media.Title}</span>
    {#if unFlaggedItems.length > 0}<PlayFilled class="continue" />{/if}
</div>

<style>
    .media {
        padding-top: 2px;
        padding-bottom: 2px;
        cursor: pointer;
        overflow: hidden;
        display: flex;
    }
    .media:hover {
        background-color: var(--cds-hover-ui);
    }
    .media.selected {
        background-color: var(--cds-active-ui);
    }
    .bookmark {
        flex: initial;
        display: inline-block;
    }
    .title {
        flex: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .media :global(.continue) {
        flex: initial;
        flex-shrink: 0;
        color: var(--cds-interactive-01);
    }
</style>
