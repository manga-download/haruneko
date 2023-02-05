<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { IMediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
    export let page: IMediaItem;
    export let alt: string;
    let loaded=false;
    let dataload: Promise<Blob>;
    dataload = page
        .Fetch(Priority.High, new AbortController().signal);

    onDestroy(() => {
        dataload.then((src) => {
            URL.revokeObjectURL(image.src);
        });
    });

    let image:HTMLImageElement;
    import { ViewerZoomRatio } from '../../stores/Settings';
    $: loaded ? image.width=image.naturalWidth * $ViewerZoomRatio : 100;
    $: loaded ? image.height=image.naturalHeight * $ViewerZoomRatio : 100;

</script>
{#await dataload}
    <InlineLoading />
{:then data}
    <img
        class="viewerimage"
        alt={page ? alt : ''}
        src={URL.createObjectURL(data)}
        bind:this={image}
        on:load={() => loaded=true}
    />

{:catch error}
    <InlineLoading
        class="viewerimage"
        type="error"
        description={error}
    />
{/await}

<style>
    .viewerimage {
        transition: width 0.2s ease-in-out, padding 0.2s ease-in-out;
        transition: height 0.2s ease-in-out, padding 0.2s ease-in-out;
        margin-left: auto !important;
        margin-right: auto !important;
        pointer-events: none;
    }
</style>