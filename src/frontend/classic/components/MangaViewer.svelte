<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";
    import { onMount } from "svelte";

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let imagePadding: number;
    export let currentImage: number;
    $: nextImage = currentImage + 1;

    const carbonLgBreakpoint = 1056;
    const carbonMaxBreakpoint = 1584;
    const minImageWidth = 50;
    const maxImageWidth = 100;
    let imageWidth: number;

    let isDoublePage = true;

    const handleKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === "ArrowRight") {
            incrementCurrentImage();
        } else if (evt.key === "ArrowLeft") {
            decrementCurrentImage();
        }
    };

    const incrementCurrentImage = () => {
        if (
            (!isDoublePage && currentImage < item.Entries.length - 1) ||
            (isDoublePage && nextImage < item.Entries.length - 1)
        ) {
            currentImage = isDoublePage ? currentImage + 2 : currentImage + 1;
        }
    };

    const decrementCurrentImage = () => {
        if (currentImage > 0) {
            currentImage = isDoublePage ? currentImage - 2 : currentImage - 1;
        }
    };

    const setImageWidth = () => {
        const winWidth = nw.Window.get().width;

        if (winWidth < carbonLgBreakpoint) {
            imageWidth = maxImageWidth;
        } else if (winWidth > carbonMaxBreakpoint) {
            imageWidth = minImageWidth;
        } else {
            // smooth transition from 100% to 50%
            imageWidth =
                ((maxImageWidth - minImageWidth) /
                    (carbonLgBreakpoint - carbonMaxBreakpoint)) *
                    (winWidth - carbonLgBreakpoint) +
                maxImageWidth;
        }
    };

    const getImageUrl = (imageNumber: number) =>
        imageNumber <= item.Entries.length - 1
            ? item.Entries[imageNumber].SourceURL
            : "";

    onMount(() => {
        setImageWidth();
    });
</script>

<svelte:window
    on:keydown={(evt) => handleKeyDown(evt)}
    on:resize={() => setImageWidth()}
/>
{#if isDoublePage}
    <WideViewerImage
        alt="content_{currentImage}"
        src={getImageUrl(currentImage)}
        class="manga-image double-page-image"
        style="padding-top: {imagePadding}em; padding-bottom: {imagePadding}em; padding-left: {imagePadding}em; padding-right: {imagePadding /
            2}em;"
        {throttlingDelay}
    />
    <WideViewerImage
        alt="content_{currentImage}"
        src={getImageUrl(nextImage)}
        class="manga-image double-page-image"
        style="padding-top: {imagePadding}em; padding-bottom: {imagePadding}em; padding-right: {imagePadding}em; padding-left: {imagePadding /
            2}em;"
        {throttlingDelay}
    />
{:else}
    <WideViewerImage
        alt="content_{currentImage}"
        src={getImageUrl(currentImage)}
        class="manga-image"
        style="padding: {imagePadding}em; width: {imageWidth}%; ;"
        {throttlingDelay}
    />
{/if}

<style>
</style>
