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

{#await dataload}
    <InlineLoading />
{:then data}
    <ImageLoader
        class="viewerimage"
        style="width: var(--viewer-zoom);"
        alt={page ? alt : ''}
        src={data}
        fadeIn
    >
        <svelte:fragment slot="loading"><InlineLoading /></svelte:fragment>
        <svelte:fragment slot="error">
            <InlineLoading
                class="viewerimage"
                status="error"
            />
        </svelte:fragment>
    </ImageLoader>
{:catch error}
    <InlineLoading
        class="viewerimage"
        type="error"
        description={error}
    />
{/await}
