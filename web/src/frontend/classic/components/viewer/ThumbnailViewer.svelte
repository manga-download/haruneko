<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type {
        IMediaContainer,
        IMediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    import ThumbnailViewerImage from './ThumbnailViewerImage.svelte';
    import { InlineNotification } from 'carbon-components-svelte';

    export let item: IMediaContainer;

    // TODO: Implement correct filter/extraction of IMediaItem types ...
    let entries: IMediaItem[];
    $: entries = item.Entries.map((entry) => entry as IMediaItem);
</script>

<div>
    {#if entries.length === 0}
        <InlineNotification
            lowContrast
            hideCloseButton
            kind="info"
            title="Nothing to show:"
            subtitle="content list is empty."
        />
    {/if}
    {#each entries as content, index}
        <ThumbnailViewerImage
            page={content}
            title="Page {index}"
            on:view={() => dispatch('view',index)}
        />
    {/each}
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        text-align: center;
    }
</style>
