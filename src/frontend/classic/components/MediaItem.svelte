<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();
    import {
        Bookmark,
        Image,
        CloudDownload,
    } from "carbon-icons-svelte";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    export let item: IMediaContainer;
    export let selected: Boolean;
    export let display = "Row";
</script>

{#if display === "Row"}
    <div class="listitem" in:fade class:selected on:click on:contextmenu>
        <span on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}><CloudDownload class="download" /></span>
        <span on:click={() => dispatch("view", item)} ><Image class="viewer" /></span>
        <span on:click={() => dispatch("bookmark", item)}><Bookmark class="bookmark" /></span>
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
