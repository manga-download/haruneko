<script lang="ts">
    import { fade } from 'svelte/transition';
    import {
        Button,
        ClickableTile,
        ContextMenu,
        ContextMenuDivider,
        ContextMenuOption,
    } from 'carbon-components-svelte';
    import {
        Star,
        StarFilled,
        PlayFilled,
        WarningAltInverted,
    } from 'carbon-icons-svelte';
    import { selectedMedia } from '../stores/Stores';
    import { coinflip } from '../lib/transitions';

    import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
    import { Bookmark } from '../../../engine/providers/Bookmark';

    export let media: MediaContainer<MediaContainer<MediaChild>>;
    let selected: boolean = false;
    $: selected = $selectedMedia?.IsSameAs(media);

    //Bookmarks
    $: isBookmarked = media ? HakuNeko.BookmarkPlugin.IsBookmarked(media) : false;
    async function toggleBookmark() {
        isBookmarked = await window.HakuNeko.BookmarkPlugin.Toggle(media);
    }
    $: isOrphaned = isBookmarked && (media as Bookmark).IsOrphaned ? true : false;

    //Context menu
    let mediadiv: HTMLElement;

    //Unviewed content
    let unFlaggedItems: MediaContainer<MediaChild>[] = [];
    findMediaUnFlaggedContent(media);
    HakuNeko.ItemflagManager.ContainerFlagsEventChannel.Subscribe(() => findMediaUnFlaggedContent(media))

    async function findMediaUnFlaggedContent(media: MediaContainer<MediaContainer<MediaChild>>) {
        unFlaggedItems = await HakuNeko.ItemflagManager.GetUnFlaggedItems(media);
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

<div bind:this={mediadiv} class="media" in:fade class:selected>
    {#if isOrphaned}
        <span in:coinflip={{ duration: 200 }}>
            <Button
                class="orphaned"
                size="small"
                kind="ghost"
                icon={WarningAltInverted}
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Plugin missing : remove"
                on:click={toggleBookmark}
            />
        </span>
    {:else if isBookmarked}
        <span in:coinflip={{ duration: 200 }}>
            <Button
                class="bookmarked"
                size="small"
                kind="ghost"
                icon={StarFilled}
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Remove from bookmarks"
                on:click={toggleBookmark}
            />
        </span>
    {:else}
        <span in:coinflip={{ duration: 200 }}>
            <Button
                size="small"
                kind="ghost"
                icon={Star}
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Add to bookmarks"
                on:click={toggleBookmark}
            />
        </span>
    {/if}
    <ClickableTile
        class="title"
        on:click={(e) => {
            e.preventDefault();
            $selectedMedia = media;
        }}
    >
        <span title={media.Title}>{media.Title}</span>
    </ClickableTile>
    {#if unFlaggedItems.length > 0}
        <Button
            icon={PlayFilled}
            kind="ghost"
            size="small"
            on:click={(e) => {
                e.preventDefault();
                $selectedMedia = media;
            }}
        />
    {/if}
</div>

<style>
    .media {
        display: flex;
        user-select: none;
    }
    .media:hover {
        background-color: var(--cds-hover-row);
        --cds-ui-01: var(--cds-hover-row);
    }
    .media.selected {
        background-color: var(--cds-selected-ui);
        --cds-ui-01: var(--cds-selected-ui);
    }
    .media :global(.title) {
        flex: auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-height: unset;
        display: flex;
        align-items: center;
        padding: 0;
    }
    .media :global(button) {
        min-height: unset;
    }

    .media :global(button.bookmarked) {
        --cds-icon-01: var(--cds-support-03);
    }
    .media :global(button.orphaned) {
        --cds-icon-01: var(--cds-button-danger-secondary);
    }
    .media :global(button:hover) {
        --cds-icon-01: var(--cds-hover-secondary);
    }
</style>
