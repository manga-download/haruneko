<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { MediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
    export let page: MediaItem;
    export let alt: string;
    let loaded = false;
    let dataload: Promise<Blob>;
    let image: HTMLImageElement;
    dataload = page.Fetch(Priority.High, new AbortController().signal);

    onDestroy(() => {
        dataload.then((_src) => {
            URL.revokeObjectURL(image?.src);
        });
    });

    import { ViewerZoomRatio } from '../../stores/Settings';
    $: loaded ? (image.width = image.naturalWidth * $ViewerZoomRatio) : 100;
    $: loaded ? (image.height = image.naturalHeight * $ViewerZoomRatio) : 100;
</script>

{#await dataload}
    <InlineLoading class="imgpreview center {$$props.class}" on:click />
{:then data}
    {#if data?.type.startsWith('image')}
        <img
            class="imgpreview {$$props.class}"
            alt={page ? alt : ''}
            src={URL.createObjectURL(data)}
            draggable="false"
            bind:this={image}
            on:load={() => (loaded = true)}
        />
    {:else}
        <InlineLoading
            class="imgpreview center {$$props.class}"
            status="error"
            description="Resource is not an image"
            on:click
        />
    {/if}
{:catch error}
    <InlineLoading
        class="imgpreview {$$props.class}"
        status="error"
        description={error}
        on:click
    />
{/await}

<style>
    img {
        display: flex;
    }
    img.wide {
        transition: width 50ms ease-in-out;
        transition: height 50ms ease-in-out;
    }
    img.thumbnail {
        transition: width 100ms ease-in-out;
        transition: height 100ms ease-in-out;
    }
</style>
