<script lang="ts">
    import { Loading } from 'carbon-components-svelte';
    import type { MediaContainer, MediaItem } from '../../../../engine/providers/MediaPlugin';
    import ImageViewer from './ImageViewer.svelte';
    import VideoViewer from './VideoViewer.svelte';
    import {
        selectedItem,
        selectedItemPrevious,
        selectedItemNext,
    } from '../../stores/Stores';
    import { FlagType } from '../../../../engine/ItemflagManager';

    export let mode: 'Image' | 'Video' = 'Image';
    export let item: MediaContainer<MediaItem>;
    let displayedItem: MediaContainer<MediaItem>;;
    let currentImageIndex: number = -1;

    let updating: Promise<void> | undefined;
    $: refresh(item);
    async function refresh(item: MediaContainer<MediaItem>) {
        updating = item.Update();
        await updating;
        displayedItem = item;
    }

    function onPreviousItem() {
        currentImageIndex = -1;
        $selectedItem = $selectedItemPrevious;
    }
    function onNextItem() {
        currentImageIndex = -1;
        if (wide && !$selectedItemNext) markAsCurrent(item);
        $selectedItem = $selectedItemNext;
    }
    function onClose() {
        markAsCurrent(item);
    }

    async function markAsCurrent(itemtoflag: MediaContainer<MediaItem>) {
        let currentIndex = -1;
        let itemtoflagIndex = -1;
        const flags = await HakuNeko.ItemflagManager.GetContainerItemsFlags(
            itemtoflag.Parent
        );

        await Promise.all(
            item.Parent.Entries.Value.map(async (entry, index) => {
                if (entry.IsSameAs(itemtoflag))
                    itemtoflagIndex = index;
                const flag = await HakuNeko.ItemflagManager.GetItemFlagType(
                    entry
                );
                if (flag === FlagType.Current) currentIndex = index;
            })
        );

        const isCurrentBookmarkAfter = itemtoflagIndex < currentIndex;
        HakuNeko.ItemflagManager.FlagItem(
            itemtoflag,
            isCurrentBookmarkAfter ? FlagType.Current : FlagType.Viewed
        );
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
        <p class="info error">Unable to load item : {error.detail}</p>
    {/await}
    {#if displayedItem}
        {#key displayedItem}
            {#if mode === 'Image'}
                <ImageViewer
                    item={displayedItem}
                    {currentImageIndex}
                    bind:wide
                    on:nextItem={onNextItem}
                    on:previousItem={onPreviousItem}
                    on:close={onClose}
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
