<script lang="ts">
    import { Loading } from "carbon-components-svelte";
    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import ThumbnailViewer from './ThumbnailViewer.svelte';
    import WideViewer from './WideViewer.svelte';
    import VideoViewer from './VideoViewer.svelte';

    type Mode = 'Thumbnail' | 'Wide' | 'Video';

    export let item: IMediaContainer;
    export let mode: Mode = 'Thumbnail';
    let currentImageIndex: number = 0;

    let update: Promise<void> | undefined;
    $: update = item?.Update();

    function toggleThumbnailViewer() {
        mode = 'Thumbnail';
    }
    function toggleWideViewer(imageIndex: number) {
        currentImageIndex = imageIndex;
        mode = 'Wide';
    }
</script>

<div id="Viewer"> 
    <div id="Contents" class="{mode} center">
        {#await update}
            <div class="loading">
                <div class="center"><Loading withOverlay={false} /></div>
                <div class="center">... items</div>
            </div>
        {:then}
            {#if mode === 'Thumbnail'}
                <ThumbnailViewer {item} {toggleWideViewer} />
            {:else if mode === 'Wide'}
                <WideViewer
                    {item}
                    {currentImageIndex}
                    {toggleThumbnailViewer}
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
    #Contents .loading {

        padding: 20em;
    }
    .error {
        color: red;
    }
</style>
