<script lang="ts">
    import { fly } from "svelte/transition";
    import { preloadImage } from "../utils/image";

    export let throttlingDelay: number;
    export let src: string;
    export let alt: string;
    export let imageWidth: number;
    export let imagePadding: number;
</script>

{#await preloadImage(src, throttlingDelay) then _}
    <img
        {alt}
        class="image"
        {src}
        style="width: {imageWidth}%; margin: {imagePadding}em;"
        in:fly
    />
{/await}

<style>
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
    }
</style>
