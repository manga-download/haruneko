<script lang="ts">
    import {
        Button,
        ClickableTile,
        ContextMenu,
        ContextMenuOption,
    } from 'carbon-components-svelte';
    import Star from 'carbon-icons-svelte/lib/Star.svelte';
    import StarFilled from 'carbon-icons-svelte/lib/StarFilled.svelte';
    import PlayFilled from 'carbon-icons-svelte/lib/PlayFilled.svelte';
    import WarningAltInverted from 'carbon-icons-svelte/lib/WarningAltInverted.svelte';
    import { Store as UI } from '../stores/Stores.svelte';
    import { coinflip } from '../lib/transitions';

    import type {
        MediaContainer,
        MediaChild,
    } from '../../../engine/providers/MediaPlugin';
    import { Bookmark } from '../../../engine/providers/Bookmark';
    import { onDestroy, onMount } from 'svelte';
    import type { MediaContainer2 } from '../Types';


    interface Props {
        style?: string;
        // TODO: Instead of conditional pollution, split component into one for showing containers and one for showing bookmarks
        media: MediaContainer2 | Bookmark;
    }

    let { style = '', media }: Props = $props();
    let selected: boolean = $derived(UI.selectedMedia?.IsSameAs(media));

    // Bookmarks
    let isBookmarked=$state(false);
    let isMediaOrphanedBookmark = $state(true);
    $effect(() => {
        if(!media) return;
        isBookmarked = HakuNeko.BookmarkPlugin.IsBookmarked(media);
        isMediaOrphanedBookmark = media instanceof Bookmark && media.IsOrphaned;
    });
    async function toggleBookmark() {
        isBookmarked = await window.HakuNeko.BookmarkPlugin.Toggle(media as MediaContainer2);
    }
    //Context menu
    let mediadiv: HTMLElement = $state();

    //Unviewed content
    let unFlaggedItems: MediaContainer<MediaChild>[] = $state([]);
    let delayedContentCheck;


    async function findMediaUnFlaggedContent(updatedmedia:MediaContainer<MediaChild>) {
        if (!updatedmedia.IsSameAs(media)) return;
        
        unFlaggedItems = [];
        const delay = !UI.selectedMedia || UI.selectedMedia?.IsSameAs(HakuNeko.BookmarkPlugin) ? 0 : 800;
        delayedContentCheck = setTimeout(
        async () => {
            unFlaggedItems = (await HakuNeko.ItemflagManager.GetUnFlaggedItems(
                media as MediaContainer2,
            )) as MediaContainer<MediaChild>[];
        },delay);
    }
    findMediaUnFlaggedContent(media);

    onMount(() => {
        HakuNeko.ItemflagManager.ContainerFlagsEventChannel.Subscribe(findMediaUnFlaggedContent);
    });

    onDestroy(() => {
        clearTimeout(delayedContentCheck);
        HakuNeko.ItemflagManager.ContainerFlagsEventChannel.Unsubscribe(findMediaUnFlaggedContent);
        document.removeEventListener('contextmenu', outsideClickListener);
    });

    // clear menu when right click outside
    let menuOpen = $state(false);

    function outsideClickListener(event) {
        if (open && !mediadiv.contains(event.target)) {
            menuOpen=false;
            document.removeEventListener('contextmenu', outsideClickListener);
        }
    }
    function menuOpens() {
        document.addEventListener('contextmenu', outsideClickListener);
    }
    

</script>

<div bind:this={mediadiv} class="media" {style} class:selected>
    <ContextMenu target={[mediadiv]} bind:open={menuOpen} on:open={menuOpens}>
        <ContextMenuOption indented labelText="Browse Chapters" shortcutText="⌘B" 
            onclick={() => {UI.selectedMedia = media;}}
        />
        <ContextMenuOption
            indented
            labelText={isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks'}
            shortcutText="⌘F"
            onclick={toggleBookmark}
        />
    </ContextMenu>
    {#if isMediaOrphanedBookmark}
        <span in:coinflip={{ duration: 200 }}>
            <Button
                class="orphaned"
                size="small"
                kind="ghost"
                icon={WarningAltInverted}
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Plugin missing : remove"
                onclick={toggleBookmark}
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
                onclick={toggleBookmark}
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
                onclick={toggleBookmark}
            />
        </span>
    {/if}
    {#if !isMediaOrphanedBookmark}
        <button 
            class="website"
            onclick={() => window.open(media.Parent.URI.href, '_blank')}
            title="Open {media.Parent.URI.href}"
            aria-label="Open {media.Parent.URI.href}"
        >
            <img
                class="pluginIcon"
                src={media.Parent.Icon}
                alt="Media Plugin Icon"
            />
        </button>
    {/if}
    <ClickableTile
        class="title"
        onclick={(e: MouseEvent) => {
            e.preventDefault();
            if(!isMediaOrphanedBookmark) UI.selectedMedia = media;
        }}
    >
        <span title={media.Title}>{media.Title}</span>
    </ClickableTile>
    {#if unFlaggedItems.length > 0}
        <Button
            icon={PlayFilled}
            kind="ghost"
            size="small"
            iconDescription="Unflagged items ({unFlaggedItems.length})"
            tooltipPosition="left"
            onclick={(e:MouseEvent) => {
                e.preventDefault();
                UI.selectedMedia = media;
            }}
        />
    {/if}
</div>

<style>
    .media {
        display: flex;
        user-select: none;
        height:1.6em;
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
    .media button.website {
        position:relative;
        top:0.2em;
        padding:0;
        border: none;
        background: none;
        background-color: unset;
        margin-right: 0.4em; 
        cursor: pointer;
    }
    .media .pluginIcon {
        width: 1.4em;
        height: 1.4em;
        border-radius:20%;
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
