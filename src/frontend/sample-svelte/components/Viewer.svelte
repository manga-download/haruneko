<script lang="ts">
    import {
        Icon
    } from "carbon-components-svelte";
    import ChevronLeft24 from "carbon-icons-svelte/lib/ChevronLeft24";
    import ChevronRight24 from "carbon-icons-svelte/lib/ChevronRight24";
    import ZoomIn24 from "carbon-icons-svelte/lib/ZoomIn24";
    import ZoomOut24 from "carbon-icons-svelte/lib/ZoomOut24";
    import RowInsert24 from "carbon-icons-svelte/lib/RowInsert24";
    import RowDelete24 from "carbon-icons-svelte/lib/RowDelete24";
    import Misuse24 from "carbon-icons-svelte/lib/Misuse24";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type {IChapter,IPage } from '../../../engine/MangaProvider';

    export let chapter: IChapter | null;
    let pages: Promise<IPage[]> = chapter?.GetPages() ?? Promise.resolve([]);
    export let mode ='pagesThumbnail'; //'pagesThumbnail','pagesWide','video'

    let imageWidth = 75;
    let imagePadding = 2;

    function increaseImagePadding (){}
    function decreaseImagePadding (){}
    function zoomIn(){}
    function zoomOut(){}
    function hideViewer(){}
</script>
<style>
    #viewer{
        width: calc(100% - 2em);
        height: calc(100% - 2em);
        padding: 1em;
        overflow-y: scroll;
        background-image: var(--page-background-image);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left top;
        user-select: none;
        grid-area: Content;
    }
    .error {
        color: red;
    }

    .thumbnail {
        display: inline-block;
        border: var(--page-thumbnail-border);
        background-color: var(--page-thumbnail-background-color);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 1em;
        margin: 0.5em;
        width: 16em;
        height: 16em;
        cursor: pointer;
        box-shadow: var(--page-thumbnail-shadow);
    }

    #pagesWide{
        /* full app width doesn't work ?
        position:absolute;
        background-color: var(--cds-ui-01);*/
        width:100%;
        height:100%;
        z-index: 100;
    }
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
    }
    #buttons {
        position: fixed;
        top: 0;
        right: 0;
        padding-left: 1em;
        padding-right: 2.0em;
        opacity: 0.05;
        transition: opacity 0.25s;
        background-color: var(--page-viewer-title-background-color);
        border-bottom-left-radius: 1em;
        box-shadow: var(--page-viewer-title-shadow);
        outline: none; /* disable focus border */
    }
    #buttons:hover {
        opacity: 1.0;
    }
    #buttons:hover > .title {
        display: inline;
    }

    .title {
        display: none;
        font-weight: bold;
        font-size: 1.25em;
        color: var(--page-chapter-title-color);
    }
    .button {
        cursor: pointer;
        margin: 0.25em;
    }
    #fullscreen {
        width: 100%;
        height: 100%;
        background-color: var(--page-video-background-color);
    }
    #video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        outline: none !important;
    }
    video::-webkit-media-controls-fullscreen-button {
        display: none;
    }

    /* hack to allow video to expand size when wrapped in subtitle container */
    .ASS-container, .ASS-container svg {
        width: 100% !important;
        height: 100% !important;
    }
    /* hack to show subtitles when video is in fullscreen mode */
    .ASS-stage {
        z-index: 2147483647;
    }
</style>
<div id="viewer">
    {#if mode==='pagesThumbnail' || mode==='pagesWide'}
        <div id="pages" class="{mode}">
            {#await pages}
                <p>...loading chapter</p>
            {:then pages}
                {#if mode==='pagesWide'}
                    <div id="buttons" tabindex="0" on-blur="focus()" on-keydown="onKeyDown">
                        <span class="title">{chapter?.Title ?? 'unkown'}</span>
                        <Icon label="Chapter Down (ArrowLeft)" render={ChevronLeft24} on:click={e => dispatch('requestChapterDown',chapter) }/>
                        <Icon label="Chapter Up (ArrowRight)" render={ChevronRight24} on:click={e => dispatch('requestChapterUp',chapter) }/>
                        &nbsp;
                        <Icon label="Decrease spacing between images (CTRL ➖)" render={RowDelete24} on:click={decreaseImagePadding}/>
                        <Icon label="Increase spacing between images (CTRL ➕)" render={RowInsert24} on:click={increaseImagePadding}/>
                        &nbsp;
                        <Icon label="Zoom In (➕)" render={ZoomIn24} on:click={zoomIn}/>
                        <Icon label="Zoom Out (➖)" render={ZoomOut24} on:click={zoomOut}/>
                        &nbsp
                        <Icon label="Close (ESC)" render={Misuse24} on:click={()=> mode='pagesThumbnail'}/>
                    </div>
                {/if}
                {#each pages as pagefetch,index}
                    {#await pagefetch.GetImage()}
                        <p>...loading image</p>
                    {:then page}
                        {#if mode==='pagesThumbnail'}
                        <div class="thumbnail" style="background-image: url('{page}');" on:click={() => mode='pagesWide'} title="Page { index }"/>
                        {:else if mode==='pagesWide'}
                        <img id="page_{index}" alt="page_{index}" class="image" src="{page}" style="width: {imageWidth}%; margin: {imagePadding}em;" on-error="imgError(this)"/>
                        {/if}
                    {:catch error}
                        <p class="error">{error.message}</p>
                    {/await}
                {/each}
            {:catch error}
                <p class="error">Unable to load chapter : {error.message}</p>
            {/await}
        </div>
    {:else if mode==='video'}
        <!-- WIP nothing to see here -->
        <div id="fullscreen" on-dblclick="toggleFullscreen">
            <!-- disablePictureInPicture controlsList="nodownload nofullscreen" -->
            <video id="video" controls >
                <!-- dummy tracks to show subtitle menu in video player -->
                <template is="dom-repeat" items="[[ media.subtitles ]]">
                    <!-- dummy tracks to show subtitle menu in video player -->
                    <track kind="captions" src="data:text/vtt,WEBVTT" label="[[ item.locale ]]" srclang="[[ item.locale ]]" />
                </template>
            </video>
        </div>
    {:else}
        Unknown mode requested
    {/if}
</div>