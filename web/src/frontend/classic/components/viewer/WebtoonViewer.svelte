<script lang="ts">
    import type {
        IMediaContainer,
        IMediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    import WideViewerImage from './WideViewerImage.svelte';
    import { InlineNotification } from 'carbon-components-svelte';

    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';

    export let item: IMediaContainer;

    // TODO: Implement correct filter/extraction of IMediaItem types ...
    let entries: IMediaItem[];
    $: entries = item.Entries as IMediaItem[];
</script>

{#if entries.length === 0}
    <div class="center" style="width:100%;height:100%;">
        <InlineNotification
            hideCloseButton
            kind="info"
            title="Nothing to show:"
            subtitle="content list is empty."
        />
    </div>
{/if}
{#each entries as content, index}
    <WideViewerImage
        alt="content_{index}"
        page={content}
        style="padding-bottom: {$ViewerPadding}em; width: {$ViewerZoom}%"
    />
{/each}
