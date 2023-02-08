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

    export let mode: 'Image'| 'Video' = 'Image';
    export let item: IMediaContainer;
    let displayedItem:IMediaContainer;
    let currentImageIndex: number = -1;

    let updating: Promise<void> | undefined;
    $: refresh(item);
    async function refresh(item:IMediaContainer){
        updating = item.Update();
        await updating;
        displayedItem=item;
    }

    function onPreviousItem() {
        currentImageIndex=-1;
        $selectedItem = $selectedItemPrevious;
    }
    function onNextItem() {
        currentImageIndex=-1;
        $selectedItem = $selectedItemNext;
    }
    let wide=false;
</script>
<div id="Viewer" class="{mode} center" class:wide={wide}>
    {#await updating}
        <div class="info loading">
            <div class="center"><Loading withOverlay={false} /></div>
            <div class="center">... items</div>
        </div>
    {:catch error}
        <p class="info error">Unable to load item : {error.detail}</p>
    {/await}
    {#if displayedItem}
        {#key displayedItem}
            {#if mode === 'Image'}
                <ImageViewer
                item={displayedItem}
                {currentImageIndex}
                bind:wide
                on:nextItem={() => onNextItem()}
                on:previousItem={() => onPreviousItem()}
                />
            {:else if mode === 'Video'}
                <VideoViewer />
            {:else}
                Unknown mode requested
            {/if}
        {/key}
    {/if}
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
    #Viewer.wide {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        z-index: 10000;
        padding:0;
        background-color: var(--cds-ui-01);
    }
    #Viewer .info  {
        position: absolute;
        z-index: 10001;
    }
    .error {
        color: red;
    }

    .hide {
        display: none;
    }
</style>
