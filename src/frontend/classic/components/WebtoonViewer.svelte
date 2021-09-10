<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let imagePadding: number;
    let imageWidth = 75;
</script>

{#each item.Entries as content, index}
    <WideViewerImage
        alt="content_{index}"
        src={content.SourceURL}
        style="padding-left: {imagePadding}em; padding-right: {imagePadding}em; width: {imageWidth}%"
        throttlingDelay={throttlingDelay * index}
    />
{/each}

<style>
</style>
