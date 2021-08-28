<script lang="ts">
    import { fly } from "svelte/transition";
    import { preloadImage } from "../utils/image";

    export let throttlingDelay: number;
    export let src: string;
    export let alt: string;
</script>

{#await preloadImage(src, throttlingDelay) then _}
    <img {alt} class="image" {src} style={$$restProps.style} in:fly />
{/await}

<style>
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
    }
</style>
