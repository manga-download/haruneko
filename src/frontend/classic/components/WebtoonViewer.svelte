<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let imagePadding: number;
    export let imageWidth: number;
</script>

{#each item.Entries as content, index}
    <WideViewerImage
        alt="content_{index}"
        src={content.SourceURL}
        {imagePadding}
        {imageWidth}
        throttlingDelay={throttlingDelay * index}
    />
{/each}
