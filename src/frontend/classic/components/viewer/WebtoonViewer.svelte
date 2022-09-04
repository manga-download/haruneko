<script lang="ts">
    import type {
        IMediaContainer,
        IMediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    import WideViewerImage from './WideViewerImage.svelte';

    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';

    export let item: IMediaContainer;

    // TODO: Implement correct filter/extraction of IMediaItem types ...
    let entries: IMediaItem[];
    $: entries = item.Entries.map((entry) => entry as IMediaItem);
</script>

{#each entries as content, index}
    <WideViewerImage
        alt="content_{index}"
        page={content}
        style="padding-bottom: {$ViewerPadding}em; width: {$ViewerZoom}%"
    />
{/each}
