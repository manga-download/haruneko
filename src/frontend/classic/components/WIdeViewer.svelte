<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";
    import WideViewerSetting from "./WideViewerSetting.svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let toggleThumbnailViewer: () => void;
    let wideMode: "webtoon" | "manga" = "webtoon";
    let imageWidth = 75;
    let imagePadding = 2;
    const title = item?.Parent?.Title ?? "unkown";
</script>

<WideViewerSetting {title} {toggleThumbnailViewer} />
{#each item.Entries as content, index}
    <WideViewerImage
        alt="content_{index}"
        src={content.SourceURL}
        {imagePadding}
        {imageWidth}
        throttlingDelay={throttlingDelay * index}
    />
{/each}
