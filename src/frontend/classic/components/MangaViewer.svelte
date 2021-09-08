<script lang="ts">
    import type {
        IMediaContainer,
        IMediaChild,
    } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";
    import { onMount } from "svelte";
    import { preloadImage } from "../utils/image";
    import { inversedReading, doublePage } from "../utils/storage";

    type ChapterImages = { src: string; nextSrc: string | undefined };

    export let item: IMediaContainer;
    export let throttlingDelay: number;
    export let imagePadding: number;
    export let currentImageIndex: number;

    let chapterImages: ChapterImages[] | undefined = undefined;
    const carbonLgBreakpoint = 1056;
    const carbonMaxBreakpoint = 1584;
    const minImageWidth = 50;
    const maxImageWidth = 100;
    let imageWidth: number;

    const handleKeyDown = (evt: KeyboardEvent) => {
        if (
            (!$inversedReading && evt.key === "ArrowRight") ||
            ($inversedReading && evt.key === "ArrowLeft")
        ) {
            incrementCurrentImage();
        } else if (
            (!$inversedReading && evt.key === "ArrowLeft") ||
            ($inversedReading && evt.key === "ArrowRight")
        ) {
            decrementCurrentImage();
        }
    };

    const incrementCurrentImage = () => {
        if (chapterImages && currentImageIndex < chapterImages.length - 1) {
            currentImageIndex += 1;
        }
    };

    const decrementCurrentImage = () => {
        if (currentImageIndex > 0) {
            currentImageIndex -= 1;
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

    const getPromiseImages = (
        entries: IMediaChild[]
    ): Promise<HTMLImageElement>[] => {
        return entries.map(async (entrie, index) => {
            const delay = throttlingDelay * index;
            await preloadImage(entrie.SourceURL, delay);

            const img = new Image();
            img.src = entrie.SourceURL;

            return img;
        });
    };

    const awaitPromiseImages = async (
        promiseImages: Promise<HTMLImageElement>[]
    ): Promise<HTMLImageElement[]> => {
        const images: HTMLImageElement[] = [];

        for (const promiseImage of promiseImages) {
            const image = await promiseImage;
            images.push(image);
        }

        return images;
    };

    const convertImagesToChapterImages = (
        images: HTMLImageElement[]
    ): ChapterImages[] => {
        const chapterImages: ChapterImages[] = [];
        let i = 0;

        while (i < images.length) {
            let nextSrc: string | undefined = undefined;

            // should display two image
            if (
                $doublePage &&
                images[i].width < images[i].height &&
                images[i + 1].width < images[i + 1].height
            ) {
                nextSrc = images[i + 1].src;
            }

            const chapterImage = {
                src: images[i].src,
                nextSrc,
            };

            chapterImages.push(chapterImage);

            if (chapterImage.nextSrc) {
                // because we already process the i+1 image
                i += 2;
            } else {
                i++;
            }
        }

        return chapterImages;
    };

    // Convert URLs to a useful data structure
    const getChapterImages = async (): Promise<ChapterImages[]> => {
        const promiseImages = getPromiseImages(item.Entries);

        // We await all promises to have an HTMLImageElement[] instead of Promise<HTMLImageElement>[]
        const images = await awaitPromiseImages(promiseImages);

        return convertImagesToChapterImages(images);
    };

    onMount(async () => {
        setImageWidth();
        chapterImages = await getChapterImages();
    });
</script>

<svelte:window
    on:keydown={(evt) => handleKeyDown(evt)}
    on:resize={() => setImageWidth()}
/>

{#if chapterImages}
    {#each chapterImages as chapterImage, index}
        {#if chapterImage.nextSrc !== undefined}
            <div
                class={currentImageIndex === index && $inversedReading
                    ? "current is-inversed"
                    : currentImageIndex === index
                    ? "current"
                    : ""}
            >
                <WideViewerImage
                    alt="content_{currentImageIndex}"
                    src={chapterImage.src}
                    class="manga-image double-page-image"
                    style="padding-top: {imagePadding}em; padding-bottom: {imagePadding}em; padding-left: {imagePadding}em; padding-right: {imagePadding /
                        2}em;"
                    {throttlingDelay}
                />
                <WideViewerImage
                    alt="content_{currentImageIndex}"
                    src={chapterImage.nextSrc}
                    class="manga-image double-page-image"
                    style="padding-top: {imagePadding}em; padding-bottom: {imagePadding}em; padding-right: {imagePadding}em; padding-left: {imagePadding /
                        2}em;"
                    {throttlingDelay}
                />
            </div>
        {:else}
            <div class={currentImageIndex === index ? "current" : ""}>
                <WideViewerImage
                    alt="content_{currentImageIndex}"
                    src={chapterImage.src}
                    class="manga-image"
                    style="padding: {imagePadding}em; width: {imageWidth}%; ;"
                    {throttlingDelay}
                />
            </div>
        {/if}
    {/each}
{/if}

<style>
    div {
        width: 100%;
        max-height: 100%;
        display: none;
    }

    .is-inversed {
        flex-flow: row-reverse;
    }

    .current {
        display: flex;
    }
</style>
