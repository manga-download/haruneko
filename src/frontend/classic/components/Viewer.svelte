<script lang="ts">
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";
    import ThumbnailViewer from "./ThumbnailViewer.svelte";
    import WideViewer from "./WideViewer.svelte";
    import VideoViewer from "./VideoViewer.svelte";

    type Mode = "Thumbnail" | "Wide" | "Video";

    export let item: IMediaContainer;
    export let mode: Mode = "Thumbnail";
    let currentImage: number = 0;
    let throttlingDelay = 1000;

    let update: Promise<void> | undefined;
    $: update = item?.Update();

    function toggleThumbnailViewer() {
        mode = "Thumbnail";
    }
    function toggleWideViewer(imageIndex: number) {
        currentImage = imageIndex;
        mode = "Wide";
    }
</script>

<div id="Viewer">
    <div id="Contents" class={mode}>
        {#await update}
            <p>...loading items</p>
        {:then}
            {#if mode === "Thumbnail"}
                <ThumbnailViewer {item} {throttlingDelay} {toggleWideViewer} />
            {:else if mode === "Wide"}
                <WideViewer
                    {item}
                    {currentImage}
                    {throttlingDelay}
                    {toggleThumbnailViewer}
                />
            {:else if mode === "Video"}
                <VideoViewer />
            {:else}
                Unknown mode requested
            {/if}
        {:catch error}
            <p class="error">Unable to load item : {error}</p>
        {/await}
    </div>
</div>

<style>
    :global(#Viewer) {
        width: 100%;
        height: 100%;
        padding: 0.5em;
        background-image: none;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left top;
        user-select: none;
        grid-area: Content;
    }
    .error {
        color: red;
    }

    .thumbnail-image-util {
        display: none;
    }

    :global(#Viewer > #Contents.Thumbnail) {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        text-align: center;
    }

    :global(#Viewer > #Contents.Wide) {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        overflow-y: scroll;
        z-index: 10000;
        background-color: var(--cds-ui-01);
    }
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
    }
    :global(#Viewer #Buttons) {
        position: fixed;
        top: 0;
        right: 0;
        padding-left: 1em;
        padding-right: 2em;
        opacity: 0.05;
        transition: opacity 0.25s;
        background-color: var(--cds-ui-04);
        border-bottom-left-radius: 1em;
        box-shadow: 0em 0em 1em var(--cds-ui-01);
        outline: none; /* disable focus border */
    }
    :global(#Viewer #Buttons:hover) {
        opacity: 1;
    }
    :global(#Viewer #Buttons:hover > .title) {
        display: inline;
    }

    :global(#Viewer .title) {
        display: none;
        font-weight: bold;
        font-size: 1.25em;
        color: var(--cds-text-01);
    }
    :global(#Viewer .button) {
        cursor: pointer;
        margin: 0.25em;
    }

    /* hack to allow video to expand size when wrapped in subtitle container 
        .ASS-container,.ASS-container svg
    */
    .ASS-container {
        width: 100% !important;
        height: 100% !important;
    }
    /* hack to show subtitles when video is in fullscreen mode */
    .ASS-stage {
        z-index: 2147483647;
    }
</style>
