<script lang="ts">
    import ChevronLeft24 from "carbon-icons-svelte/lib/ChevronLeft24";
    import ChevronRight24 from "carbon-icons-svelte/lib/ChevronRight24";
    import ZoomIn24 from "carbon-icons-svelte/lib/ZoomIn24";
    import ZoomOut24 from "carbon-icons-svelte/lib/ZoomOut24";
    import RowInsert24 from "carbon-icons-svelte/lib/RowExpand24";
    import RowDelete24 from "carbon-icons-svelte/lib/RowCollapse24";
    import Misuse24 from "carbon-icons-svelte/lib/Misuse24";
    import { createEventDispatcher } from "svelte";
    import ViewerThumbnailImage from "./ViewerThumbnailImage.svelte";
    import ViewerImageWide from "./ViewerImageWide.svelte";
    import type { IMediaContainer } from "../../../engine/providers/MediaPlugin";

    type Mode = "Thumbnail" | "Wide" | "Video";

    export let item: IMediaContainer;
    export let mode: Mode = "Thumbnail";
    let throttlingDelay = 1000;

    const dispatch = createEventDispatcher();

    let update: Promise<void> | undefined;
    $: update = item?.Update();

    let imageWidth = 75;
    let imagePadding = 2;

    function increaseImagePadding() {}
    function decreaseImagePadding() {}
    function zoomIn() {}
    function zoomOut() {}
    function toggleThumbnailViewer() {
        mode = "Thumbnail";
        const rootdiv: any = document.getElementById("Content");
        const contentdiv: any = document.getElementById("Viewer");
        rootdiv.appendChild(contentdiv);
    }
    function toggleWideViewer() {
        mode = "Wide";
        const contentdiv: any = document.getElementById("Viewer");
        document.body.appendChild(contentdiv);
    }
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
</script>

<div id="Viewer">
    {#if mode === "Thumbnail" || mode === "Wide"}
        <div id="Contents" class={mode}>
            {#await update}
                <p>...loading items</p>
            {:then}
                {#if mode === "Wide"}
                    <div
                        id="Buttons"
                        tabindex="0"
                        on-blur="focus()"
                        on-keydown="onKeyDown"
                    >
                        <span class="title"
                            >{item?.Parent?.Title ?? "unkown"}</span
                        >
                        <ChevronLeft24
                            label="Item Down (ArrowLeft)"
                            on:click={(e) => dispatch("requestItemDown", item)}
                        />
                        <ChevronRight24
                            label="Item Up (ArrowRight)"
                            on:click={(e) => dispatch("requestItemUp", item)}
                        />
                        &nbsp;
                        <RowDelete24
                            label="Decrease spacing between images (CTRL ➖)"
                            on:click={decreaseImagePadding}
                        />
                        <RowInsert24
                            label="Increase spacing between images (CTRL ➕)"
                            on:click={increaseImagePadding}
                        />
                        &nbsp;
                        <ZoomIn24 label="Zoom In (➕)" on:click={zoomIn} />
                        <ZoomOut24 label="Zoom Out (➖)" on:click={zoomOut} />
                        &nbsp
                        <Misuse24
                            label="Close (ESC)"
                            on:click={toggleThumbnailViewer}
                        />
                    </div>
                {/if}
                {#each item.Entries as content, index}
                    <!--{#await contentfetch.GetImage()}
                        <p>...loading image</p>
                    {:then content}-->
                    {#if mode === "Thumbnail"}
                        <ViewerThumbnailImage
                            src={content.SourceURL}
                            throttlingDelay={throttlingDelay * index + 1}
                            handleClick={toggleWideViewer}
                            title="Page {index}"
                        />
                    {:else if mode === "Wide"}
                        <ViewerImageWide
                            alt="content_{index}"
                            src={content.SourceURL}
                            {imagePadding}
                            {imageWidth}
                            throttlingDelay={throttlingDelay * index}
                        />
                    {/if}
                    <!--
                    {:catch error}
                        <p class="error">{error.message}</p>
                    {/await}-->
                {/each}
            {:catch error}
                <p class="error">Unable to load item : {error}</p>
            {/await}
        </div>
    {:else if mode === "Video"}
        <!-- WIP nothing to see here -->
        <div id="FullScreen" on-dblclick="toggleFullscreen">
            <!-- disablePictureInPicture controlsList="nodownload nofullscreen" -->
            <video id="Video" controls>
                <!-- dummy tracks to show subtitle menu in video player -->
                <template is="dom-repeat" items="[[ media.subtitles ]]">
                    <!-- dummy tracks to show subtitle menu in video player -->
                    <track
                        kind="captions"
                        src="data:text/vtt,WEBVTT"
                        label="[[ item.locale ]]"
                        srclang="[[ item.locale ]]"
                    />
                </template>
            </video>
        </div>
    {:else}
        Unknown mode requested
    {/if}
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
    #FullScreen {
        width: 100%;
        height: 100%;
        background-color: var(--cds-ui-01);
    }
    #Video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        outline: none !important;
    }
    video::-webkit-media-controls-fullscreen-button {
        display: none;
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
