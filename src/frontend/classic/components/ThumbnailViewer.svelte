<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import ThumbnailViewerImage from "./ThumbnailViewerImage.svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let toggleWideViewer: (currentImage: number) => void;
</script>

{#each item.Entries as content, index}
    <ThumbnailViewerImage
        src={content.SourceURL}
        throttlingDelay={throttlingDelay * index + 1}
        title="Page {index}"
        handleClick={() => toggleWideViewer(index)}
    />
{/each}
