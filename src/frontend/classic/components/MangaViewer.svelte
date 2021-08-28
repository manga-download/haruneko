<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";
    import { onMount } from "svelte";

    export let item: IMediaContainer;
    export let currentImage: number;
    export let throttlingDelay: number;
    export let imagePadding: number;

    const carbonLgBreakpoint = 1056;
    const carbonMaxBreakpoint = 1584;
    const minImageWidth = 50;
    const maxImageWidth = 100;
    let imageWidth: number;

    const handleKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === "ArrowRight") {
            incrementCurrentImage();
        } else if (evt.key === "ArrowLeft") {
            decrementCurrentImage();
        }
    };

    const incrementCurrentImage = () => {
        if (currentImage < item.Entries.length - 1) {
            currentImage++;
        }
    };

    const decrementCurrentImage = () => {
        if (currentImage > 0) {
            currentImage--;
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

    onMount(() => {
        setImageWidth();
    });
</script>

<svelte:window
    on:keydown={(evt) => handleKeyDown(evt)}
    on:resize={() => setImageWidth()}
/>

<WideViewerImage
    alt="content_{currentImage}"
    src={item.Entries[currentImage].SourceURL}
    style="padding: {imagePadding}em; width: {imageWidth}%; max-height: 100%;"
    {throttlingDelay}
/>
