<script lang="ts">
    import { fly } from 'svelte/transition';
    import { preloadImage } from '../../utils/image';

    export let throttlingDelay: number;
    export let src: string;
    export let alt: string;

    console.log($$restProps);
</script>

{#await preloadImage(src, throttlingDelay) then _}
    <img
        alt={src ? alt : ''}
        class="image {$$restProps.class}"
        {src}
        style={$$restProps.style}
        in:fly
    />
{/await}

<style>
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
        /* background-color: azure; */
    }

    .double-page-image {
        width: 50%;
    }

    .manga-image {
        max-height: 100%;
    }
</style>
