<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    export let item: IMediaContainer;
    export let selected: Boolean;
    export let display = "Row";
</script>

{#if display === "Row"}
    <div class="listitem" class:selected on:click on:contextmenu>
        <CloudDownload16
            class="download"
            on:click={() => window.HakuNeko.DownloadManager.Enqueue(item)}
        />
        <Image16 class="viewer" on:click={() => dispatch("view", item)} />
        <Bookmark16
            class="bookmark"
            on:click={() => dispatch("bookmark", item)}
        />
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
