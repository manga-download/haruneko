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

<span class="imageContainer">
    {#await dataload}
        <InlineLoading class={$$restProps.class} />
    {:then data}
        <ImageLoader
            class="image {$$restProps.class}"
            style={$$restProps.style}
            alt={page ? alt : ''}
            src={data}
            fadeIn
        >
            <svelte:fragment slot="loading"><InlineLoading /></svelte:fragment>
            <svelte:fragment slot="error">
                <InlineLoading
                    class="image {$$restProps.class}"
                    status="error"
                />
            </svelte:fragment>
        </ImageLoader>
    {:catch error}
        <InlineLoading
            class={$$restProps.class}
            type="error"
            description={error}
        />
    {/await}
</span>

<style>
    .imageContainer :global(.image) {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
        /* background-color: azure; */
    }

    .imageContainer :global(.image .double-page-image) {
        width: 50%;
    }

    .imageContainer :global(.image .manga-image) {
        max-height: 100%;
    }
</style>
