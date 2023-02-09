<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { IMediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
    export let page: IMediaItem;
    export let alt: string;
    let loaded=false;
    let dataload: Promise<Blob>;
    let image:HTMLImageElement;
    dataload = page
        .Fetch(Priority.High, new AbortController().signal);

    onDestroy(() => {
        dataload.then((_src) => {
            URL.revokeObjectURL(image?.src);
        });
    });

    import { ViewerZoomRatio } from '../../stores/Settings';
    $: loaded ? image.width=image.naturalWidth * $ViewerZoomRatio : 100;
    $: loaded ? image.height=image.naturalHeight * $ViewerZoomRatio : 100;

</script>
{#await dataload}
    <InlineLoading class={$$props.class} />
{:then data}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
        class={$$props.class}
        alt={page ? alt : ''}
        src={URL.createObjectURL(data)}
        draggable="false"
        bind:this={image}
        on:click
        on:load={() => loaded=true}
    />

{:catch error}
    <InlineLoading
        class={$$props.class}
        type="error"
        description={error}
    />
{/await}

<style>
    img.wide {
        transition: width 50ms ease-in-out;
        transition: height 50ms ease-in-out;
    }
    img.thumbnail {
        transition: width 100ms ease-in-out;
        transition: height 100ms ease-in-out;
    }
</style>