<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    export let media: IMediaContainer;
    export let selected: Boolean;
</script>

<div class="media" class:selected on:click={(e) => dispatch("select", media)}>
    {media.Title}
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
