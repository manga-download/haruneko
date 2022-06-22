<script lang="ts">
    import type {
        IMediaContainer,
        IMediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    import ThumbnailViewerImage from './ThumbnailViewerImage.svelte';

    export let item: IMediaContainer;
    export let hide:boolean=false;

    // TODO: Implement correct filter/extraction of IMediaItem types ...
    let entries: IMediaItem[];
    $: entries = item.Entries.map((entry) => entry as IMediaItem);

    export let toggleWideViewer: (currentImage: number) => void;
</script>

<div class:hide={hide}>
    {#each entries as content, index}
        <ThumbnailViewerImage
            page={content}
            title="Page {index}"
            on:view={() => toggleWideViewer(index)}
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
    .hide {
        display:none;
    }
</style>
