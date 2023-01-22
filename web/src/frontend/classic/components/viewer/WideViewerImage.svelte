<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { IMediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { ImageLoader, InlineLoading } from 'carbon-components-svelte';
    export let page: IMediaItem;
    export let alt: string;
    let dataload: Promise<string>;
    dataload = page
        .Fetch(Priority.High, new AbortController().signal)
        .then((data) => {
            return URL.createObjectURL(data);
        });

    onDestroy(() => {
        dataload.then((src) => {
            URL.revokeObjectURL(src);
        });
    });
</script>

<div class="wideimage">
    {#await dataload}
        <InlineLoading class={$$restProps.class ?? ''} />
    {:then data}
        <ImageLoader
            class="viewerimage {$$restProps.class ?? ''}"
            style={$$restProps.style}
            alt={page ? alt : ''}
            src={data}
            fadeIn
        >
            <svelte:fragment slot="loading"><InlineLoading /></svelte:fragment>
            <svelte:fragment slot="error">
                <InlineLoading
                    class="viewerimage {$$restProps.class ?? ''}"
                    status="error"
                />
            </svelte:fragment>
        </ImageLoader>
    {:catch error}
        <InlineLoading
            class="viewerimage {$$restProps.class ?? ''}"
            type="error"
            description={error}
        />
    {/await}
</div>

<style>
    .wideimage :global(.viewerimage) {
        display: block;
        transition: width 0.2s ease-in-out, padding 0.2s ease-in-out;
        margin-left: auto !important;
        margin-right: auto !important;
        pointer-events: none;
    }

    .wideimage :global(.viewerimage .double-page-image) {
        width: 50%;
    }

    .wideimage :global(.viewerimage .manga-image) {
        max-height: 100%;
    }
</style>
