<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

    import type { IMediaChild } from "../../../engine/providers/MediaPlugin";

    export let item: IMediaChild;
    export let selected: Boolean;
    export let display = "Row";
</script>

{#if display === "Row"}
    <div class="listitem" class:selected>
        <CloudDownload16
            class="download"
            on:click={(e) => dispatch("download", item)}
        />
        <Image16 class="viewer" on:click={(e) => dispatch("view", item)} />
        <Bookmark16
            class="bookmark"
            on:click={(e) => dispatch("bookmark", item)}
        />
        {item.Title}
    </div>
{/if}

<style>
    .listitem {
        cursor: pointer;
    }
    .listitem:hover {
        background-color: var(--cds-hover-ui);
    }
    .listitem.selected {
        background-color: var(--cds-active-ui);
    }
</style>
