<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Bookmark16 from "carbon-icons-svelte/lib/Bookmark16";
    import Image16 from "carbon-icons-svelte/lib/Image16";
    import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";

    import type { IChapter } from "../../../engine/MangaProvider";

    export let chapter: IChapter;
    export let selected: Boolean;
    export let display = "Row";
</script>

{#if display === "Row"}
    <div class="listitem" class:selected>
        <CloudDownload16
            class="download"
            on:click={(e) => dispatch("download", chapter)}
        />
        <Image16 class="viewer" on:click={(e) => dispatch("view", chapter)} />
        <Bookmark16
            class="bookmark"
            on:click={(e) => dispatch("bookmark", chapter)}
        />
        {chapter.Title}
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
