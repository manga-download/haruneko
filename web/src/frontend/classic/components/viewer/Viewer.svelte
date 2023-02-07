<script lang="ts">
    import { Loading } from 'carbon-components-svelte';
    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import ImageViewer from './ImageViewer.svelte';
    import VideoViewer from './VideoViewer.svelte';
    import {
        selectedItem,
        selectedItemPrevious,
        selectedItemNext,
    } from '../../stores/Stores';

    export let item: IMediaContainer;
    export let mode: 'Image'| 'Video' = 'Image';
    let currentImageIndex: number = -1;

    let update: Promise<void> | undefined;
    $: update = item?.Update();

    function onPreviousItem() {
        $selectedItem = $selectedItemPrevious;
    }
    function onNextItem() {
        $selectedItem = $selectedItemNext;
    }
</script>

<div id="Viewer" class="{mode} center">
    {#await update}
        <div class="loading">
            <div class="center"><Loading withOverlay={false} /></div>
            <div class="center">... items</div>
        </div>
    {:then}
        {#if mode === 'Image'}
            <ImageViewer
            {item}
            {currentImageIndex}
            on:nextItem={() => onNextItem()}
            on:previousItem={() => onPreviousItem()}
            />
        {:else if mode === 'Video'}
            <VideoViewer />
        {:else}
            Unknown mode requested
        {/if}
    {:catch error}
        <p class="error">Unable to load item : {error}</p>
    {/await}
</div>

<style>
    #Viewer {
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
    #Viewer .loading {
        padding: 20em;
    }
    .error {
        color: red;
    }
    .hide {
        display: none;
    }
</style>
