<script lang="ts">
    import { InlineNotification, Loading } from 'carbon-components-svelte';
    import type { MediaContainer, MediaItem } from '../../../../engine/providers/MediaPlugin';
    import ImageViewer from './ImageViewer.svelte';
    import VideoViewer from './VideoViewer.svelte';
    import {
        selectedItem,
        selectedItemPrevious,
        selectedItemNext,
    } from '../../stores/Stores';
    import { FlagType } from '../../../../engine/ItemflagManager';

    interface Props {
        mode?: 'Image' | 'Video';
        item: MediaContainer<MediaItem>;
    }
    let { mode = 'Image', item }: Props = $props();
    let displayedItem: MediaContainer<MediaItem> = $state();;
    let currentImageIndex: number = $state(-1);

    let updating: Promise<void> | undefined = $state();
    $effect(() => {
        refresh(item);
    });
    async function refresh(item: MediaContainer<MediaItem>) {
        updating = item.Update();
        updating.catch(() => {
            displayedItem=undefined;
        });
        await updating;
        displayedItem = item;
    }

    function onPreviousItem() {
        currentImageIndex = -1;
        $selectedItem = $selectedItemPrevious;
    }
    function onNextItem() {
        currentImageIndex = -1;
        if (wide && !$selectedItemNext) HakuNeko.ItemflagManager.FlagItem(item, FlagType.Current);
        $selectedItem = $selectedItemNext;
    }
    function onClose() {
        HakuNeko.ItemflagManager.FlagItem(item, FlagType.Current);
    }

    let wide = false;
</script>

<div id="Viewer" class="{mode} center" class:wide>
    {#await updating}
        <div class="info loading">
            <div class="center"><Loading withOverlay={false} /></div>
            <div class="center">... items</div>
        </div>
    {:catch error}
        <InlineNotification
        title="{error.name}"
        subtitle="Unable to load item : {error.message}"
        class="info error"
        />
    {/await}
    {#if displayedItem}
        {#key displayedItem}
            {#if mode === 'Image'}
                <ImageViewer
                    item={displayedItem}
                    {currentImageIndex}
                    bind:wide
                    {onNextItem}
                    {onPreviousItem}
                    {onClose}
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
        -webkit-app-region: no-drag;
        padding: 0;
        background-color: var(--cds-ui-01);
    }
    #Viewer .info {
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
