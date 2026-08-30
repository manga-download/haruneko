<script lang="ts">
    import { crossfade, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { onDestroy, onMount } from 'svelte';
    // Events

    interface Props {
        item: MediaContainer<MediaItem>;
        currentImageIndex: number;
        wide: boolean;
        onNextItem: () => void;
        onPreviousItem: () => void;
        onClose: () => void;
    };

    // UI
    import { InlineNotification } from 'carbon-components-svelte';
    // engine
    import type {
        MediaContainer,
        MediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    // svelte component
    import ImageViewerWideSettings from './ImageViewerWideSettings.svelte';
    import Image from './Image.svelte';
    // stores
    import { Key, Settings } from '../../stores/Settings.svelte';
    import { Store as UI } from '../../stores/Stores.svelte';
    // others
    import { scrollSmoothly, scrollMagic, toggleFullScreen } from './utilities';
    import { dragscroll } from '@svelte-put/dragscroll';

    onMount(() => {
        viewer.addEventListener('scroll', onScroll);
    });

    onDestroy(() => {
        document.removeEventListener('keydown', onKeyDown);
        viewer?.removeEventListener('scroll', onScroll);
    });

    let { item, currentImageIndex, wide = $bindable(), onNextItem, onPreviousItem, onClose }: Props = $props();
    let entries = $derived(item.Entries.Value);
    let viewer: HTMLElement;
    const isPaged = $derived(Settings.ViewerMode.Value === Key.ViewerMode_Paged);
    const isDoublePage = $derived(Settings.ViewerDoublePage.Value);

    function viewerclose() {
        wide = false;
        onClose();
    }

    function nextPage() {
        if (currentImageIndex >= entries.length - 1) return;
        if (!isDoublePage || currentImageIndex === entries.length - 2) currentImageIndex++;
        else currentImageIndex += 2;
    }

    // Advance by one page, allowing the user to shift the double-page spread
    function nextPageByOne() {
        if (currentImageIndex >= entries.length - 1) return;
        else currentImageIndex++;
    }

    function previousPage() {
        if (currentImageIndex <= 0) return;
        if (!isDoublePage || currentImageIndex === 1) currentImageIndex--;
        else currentImageIndex -= 2;
    }

    function onPageClick(event: MouseEvent) {
        if (!wide || !isPaged) return;

        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const reverse = Settings.ViewerReverseDirection.Value;

        if (clickX < rect.width / 3 && !reverse || clickX > rect.width * 2 / 3 && reverse) {
            previousPage();
        } else if (clickX > rect.width * 2 / 3 && !reverse || clickX < rect.width / 3 && reverse) {
            nextPage();
        }
    }

    function onWheel(event: WheelEvent) {
        if (!wide || !isPaged) return;

        event.preventDefault();
        if (event.deltaY > 0) {
            nextPage();
        } else if (event.deltaY < 0) {
            previousPage();
        }
    }

    function onKeyDown(event: KeyboardEvent) {
        switch (true) {
            case isPaged && (
                event.code === 'ArrowUp' ||
                event.code === 'PageUp'
            ):
                previousPage();
                event.preventDefault();
                break;
            case isPaged && (
                event.code === 'ArrowDown' ||
                event.code === 'PageDown'
            ):
                nextPage();
                event.preventDefault();
                break;
            case isPaged && event.code === 'Space':
                nextPageByOne();
                event.preventDefault();
                break;
            case event.code === 'ArrowUp':
                scrollSmoothly(viewer, -64);
                break;
            case event.code === 'ArrowDown':
                scrollSmoothly(viewer, 64);
                break;
            case event.code === 'PageUp':
                viewer.scrollBy({
                    top: -window.innerHeight * 0.95,
                    left: 0,
                    behavior: 'smooth',
                });
                break;
            case event.code === 'PageDown':
                viewer.scrollBy({
                    top: window.innerHeight * 0.95,
                    left: 0,
                    behavior: 'smooth',
                });
                break;
            case event.code === 'ArrowRight':
                onNextItem();
                break;
            case event.code === 'ArrowLeft':
                onPreviousItem();
                break;
            case event.key === '*':
                Settings.ViewerZoom.Value = 100;
                break;
            case event.key === '/':
                Settings.ViewerZoom.Value=Settings.ViewerZoom.Setting.Default;
                break;
            case event.key === '+' && !event.ctrlKey:
                Settings.ViewerZoom.Increment();
                break;
            case event.key === '-' && !event.ctrlKey:
                Settings.ViewerZoom.Decrement();
                break;
            case event.key === '+' && event.ctrlKey:
                Settings.ViewerPadding.Increment();
                break;
            case event.key === '-' && event.ctrlKey:
                Settings.ViewerPadding.Decrement();
                break;
            case event.code === 'Escape':
                viewerclose();
                break;
            case event.code === 'Space':
                scrollMagic(
                    viewer,
                    '.imgpreview',
                    window.innerHeight * 0.8,
                    onNextItemCallback,
                    Settings.ViewerMode.Value === Key.ViewerMode_Paginated,
                );
                event.preventDefault();
                break;
            default:
                break;
        }
    }



    // Auto next item after reaching end of page
    let autoNextItem = $state(false);
    async function onNextItemCallback() {
        if (autoNextItem && UI.selectedItemNext) onNextItem();
        else {
            autoNextItem = true;
            setTimeout(function () {
                autoNextItem = false;
            }, 4000);
        }
    }

    async function onScroll() {
        const scrollableHeight = viewer.scrollHeight - viewer.clientHeight;
        if (viewer.scrollTop >= scrollableHeight) {
            if (!autoNextItem) onNextItemCallback();
        }
    }

    // Preload next item once all images of the current item finished loading
    let loadedImageCount = $state(0);
    $effect(() => {
        entries; // reset counter whenever the item changes
        loadedImageCount = 0;
    });

    function onImageLoaded() {
        loadedImageCount++;
        if (entries.length > 0 && loadedImageCount === entries.length) {
            if (UI.selectedItemNext && Settings.ViewerPreloadNextItem.Value) preloadItem(UI.selectedItemNext);
        }
    }

    function preloadItem(item: MediaContainer<MediaItem>) {
        if (item.Entries && item.Entries.Value.length > 0) return;
        item.Update();
    }

    // Drag and drop scroll
    let pos = { top: 0, left: 0, x: 0, y: 0 };

    // Entering wide mode : scroll to image
    $effect(() => {
        if (wide) {
            if (isPaged) {
                if (currentImageIndex === -1) {
                    currentImageIndex = 0;
                }
            } else if (currentImageIndex != -1) {
                // delay because of smooth transition
                setTimeout(() => {
                    const targetScrollImage =
                        viewer.querySelectorAll('#ImageViewer>button>img')[
                            currentImageIndex
                        ];
                    targetScrollImage?.scrollIntoView({
                        inline: 'center',
                    });
                    currentImageIndex = -1;
                }, 200);
            }
            document.addEventListener('keydown', onKeyDown);
        } else {
            document.removeEventListener('keydown', onKeyDown);
            if (viewer) viewer.style.userSelect = 'none';
        }
    });

    const [send, receive] = crossfade({
        duration: 1500,
        easing: quintOut,
    });
    const ViewerPadding = $derived(Settings.ViewerPadding.Value+'em');
</script>
{#if wide}
    <ImageViewerWideSettings
        {item}
        {onNextItem}
        {onPreviousItem}
        onClose={viewerclose}
    />
{/if}
<div
    id="ImageViewer"
    bind:this={viewer}
    onclick={onPageClick}
    onwheel={onWheel}
    role="button"
    tabindex="-1"
    ondblclick={(event) => {
        if (!isPaged) {
            toggleFullScreen();
            return;
        }
        const rect = viewer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        if (
            clickX >= rect.width / 3 &&
            clickX <= rect.width * 2 / 3
        ) {
            toggleFullScreen();
        }
    }}
    transition:fade
    class:wide={wide}
    class:reverse={Settings.ViewerReverseDirection.Value}
    class="{Settings.ViewerMode.Value}"
    style:--viewer-padding={ViewerPadding}
    style:--image-zoom={Settings.ViewerZoomRatio}
    use:dragscroll={{ axis: 'both' }}
>

    {#if entries.length === 0}
        <div class="center" style="width:100%;height:100%;">
            <InlineNotification
                hideCloseButton
                kind="info"
                title="Nothing to show:"
                subtitle="content list is empty."
            />
        </div>
    {/if}

    {#each entries as content, index (index)}
        <button
            class:hidden={index !== currentImageIndex && (index !== currentImageIndex + 1 || !isDoublePage)}
            class:double-page={isDoublePage}
            onclick={() => {
                if (wide && isPaged) return;
                currentImageIndex = index;
                wide = true;
            }}
            in:send={{ key: index }}
            out:receive={{ key: index }}
        >
            <Image
                {wide}
                alt="content_{index}"
                page={content}
                onLoad={onImageLoaded}
            />
        </button>
    {/each}
</div>
{#if autoNextItem && UI.selectedItemNext !== undefined}
    <div  style="z-index: 20000; position: fixed; bottom: 2em; right: 2em;" transition:fade>
        <InlineNotification
            kind="info"
            title="Bottom reached"
            subtitle="Click or Press space again to go to next item."
            onclick={() => onNextItem()}
            on:close={() => (autoNextItem = false)}
        />
    </div>
{/if}

<style>
    button {
        all: unset;
        cursor: pointer;
    }
    #ImageViewer {
        width: 100%;
        height: 100%;
    }
    #ImageViewer:not(.wide) {
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
    }

    #ImageViewer:not(.wide) :global(.imgpreview) {
        border: 2px solid var(--cds-ui-04);
        background-color: var(--cds-ui-01);
        box-shadow: 1em 1em 2em var(--cds-ui-01);
        border-radius: 1em;
        margin: 0.5em;
        width: 16em;
        height: 16em;
        min-width: 16em;
        min-height: 16em;
        max-width: 16em;
        max-height: 16em;
        cursor: pointer;
        object-fit: contain;
    }
    #ImageViewer.wide {
        overflow: auto;
        background-color: var(--cds-ui-01);
        cursor: grab;
        align-items: center;
        transition: gap 0.2s ease-in-out;
        gap: var(--viewer-padding);
        min-width: 0;
        min-height: 0;
    }
    #ImageViewer.wide :global(img.imgpreview)  {
        zoom : var(--image-zoom);
    }
    #ImageViewer.wide.longstrip {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    #ImageViewer.wide.paginated {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 100%;
        overflow-x: auto;
    }
    /* TODO: implement RTL reading */
    #ImageViewer.wide.paginated.reverse {
        flex-flow: row-reverse;
    }
    #ImageViewer.wide.paged {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
    }
    #ImageViewer.wide.paged.reverse {
        flex-flow: row-reverse;
    }
    #ImageViewer.wide.paged button.hidden {
        display: none !important;
    }
    #ImageViewer.wide.paged :global(img.imgpreview) {
        max-height: 100vh;
        max-width: 100vw;
    }
    #ImageViewer.wide.paged button.double-page :global(img.imgpreview) {
        max-width: calc(50vw - var(--viewer-padding) / 2);
    }
</style>
