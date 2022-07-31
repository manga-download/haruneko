<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();
    import {
        Bookmark as IconBookmark,
        BookmarkFilled as IconBookmarkFilled,
        View,
        ViewFilled,
        CloudDownload,
    } from 'carbon-icons-svelte';

    import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
    import { MarkType } from '../../../engine/ItemmarkManager';

    export let item: IMediaContainer;
    export let selected: Boolean;
    export let display = 'Row';
    export let mark: MarkType;
    let itemdiv: HTMLElement;
</script>

{#if display === 'Row'}
    <div
        bind:this={itemdiv}
        class="listitem"
        in:fade
        class:selected
        on:click
        on:contextmenu
    >
        <span on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
            ><CloudDownload class="download" /></span
        >
        <span on:click={() => dispatch('view', item)}>
            {#if mark === MarkType.Viewed}
                <ViewFilled />
            {:else}
                <View />
            {/if}
        </span>
        <span on:click={() => true}>
            {#if false}
                <IconBookmarkFilled />
            {:else}
                <IconBookmark />
            {/if}
        </span>
        {item.Title}
    </div>
{/if}

<style>
    .listitem {
        cursor: pointer;
        user-select: none;
    }
    .listitem:hover {
        background-color: var(--cds-hover-ui);
    }
    .listitem.selected {
        background-color: var(--cds-active-ui);
    }
</style>
