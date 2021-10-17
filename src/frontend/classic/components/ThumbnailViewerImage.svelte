<script lang="ts">
    import { fly } from "svelte/transition";
    import { preloadImage } from "../utils/image";
    export let throttlingDelay: number;
    export let src: string;
    export let handleClick: () => void;
    export let title: string;
</script>

{#await preloadImage(src, throttlingDelay) then _}
    <div
        class="thumbnail"
        style="background-image: url('{src}');"
        on:click={handleClick}
        {title}
        in:fly
    />
{/await}

<style>
    .thumbnail {
        display: inline-block;
        border: 2px solid var(--cds-ui-04);
        background-color: var(--cds-ui-01);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 1em;
        margin: 0.5em;
        width: 16em;
        height: 16em;
        cursor: pointer;
        box-shadow: 1em 1em 2em var(--cds-ui-01);
    }
</style>
