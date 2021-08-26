<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import WideViewerImage from "./WideViewerImage.svelte";

    export let item: IMediaContainer;
    export let currentImage: number;
    export let throttlingDelay: number;
    export let imagePadding: number;
    export let imageWidth: number;

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
</script>

<svelte:window on:keydown={(evt) => handleKeyDown(evt)} />

<WideViewerImage
    alt="content_{currentImage}"
    src={item.Entries[currentImage].SourceURL}
    {imagePadding}
    {imageWidth}
    {throttlingDelay}
/>
