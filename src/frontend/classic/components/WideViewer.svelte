<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerSetting from "./WideViewerSetting.svelte";
    import WebtoonViewer from "./WebtoonViewer.svelte";
    import MangaViewer from "./MangaViewer.svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let toggleThumbnailViewer: () => void;
    export let currentImage: number;

    let wideMode: "webtoon" | "manga" = "manga";
    let imageWidth = 75;
    let imagePadding = 2;
    const title = item?.Parent?.Title ?? "unkown";
</script>

<WideViewerSetting {title} {toggleThumbnailViewer} />
{#if wideMode === "webtoon"}
    <WebtoonViewer {item} {throttlingDelay} {imagePadding} {imageWidth} />
{:else if wideMode === "manga"}
    <MangaViewer
        {item}
        {currentImage}
        {throttlingDelay}
        {imagePadding}
        {imageWidth}
    />
{/if}
