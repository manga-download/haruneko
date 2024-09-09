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
    let { item, currentImageIndex, wide = $bindable(), onNextItem, onPreviousItem, onClose }: Props  = $props();

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
    import {
        Key,
        ViewerMode,
        ViewerPadding,
        ViewerZoom,
        ViewerZoomRatio,
        ViewerReverseDirection,
    } from '../../stores/Settings';
    import { selectedItemNext } from '../../stores/Stores';
    // others
    import { scrollSmoothly, scrollMagic, toggleFullScreen } from './utilities';
    import { dragscroll } from '@svelte-put/dragscroll';

    onMount(() => {
        viewer.addEventListener('scroll', onScroll);
    });

    onDestroy(() => {
        document.removeEventListener('keydown', onKeyDown);
        viewer?.removeEventListener('scroll', onScroll);
        zoomunsubscribe();
    });

    let entries = $state(item.Entries.Value);
    let viewer: HTMLElement;

    function viewerclose() {
        wide = false;
        onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
        switch (true) {
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
                onNextItem();
                break;
            case event.key === '*':
                $ViewerZoom = 100;
                break;
            case event.key === '/':
                ViewerZoom.reset();
                break;
            case event.key === '+' && !event.ctrlKey:
                ViewerZoom.increment();
                break;
            case event.key === '-' && !event.ctrlKey:
                ViewerZoom.decrement();
                break;
            case event.key === '+' && event.ctrlKey:
                ViewerPadding.increment();
                break;
            case event.key === '-' && event.ctrlKey:
                ViewerPadding.decrement();
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
                );
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    let previousZoom = $ViewerZoomRatio;
    const zoomunsubscribe = ViewerZoomRatio.subscribe((newZoom) => {
        switch ($ViewerMode) {
            case Key.ViewerMode_Longstrip: {
                viewer?.scrollTo({
                    top: viewer.scrollTop * (newZoom / previousZoom),
                    behavior: 'smooth',
                });
                break;
            }
            case Key.ViewerMode_Paginated: {
                viewer?.scrollTo({
                    left: viewer.scrollLeft * (newZoom / previousZoom),
                    behavior: 'smooth',
                });
                break;
            }
        }
        previousZoom = newZoom;
    });

    // Auto next item after reaching end of page
    let autoNextItem = $state(false);
    async function onNextItemCallback() {
        if (autoNextItem && selectedItemNext) onNextItem();
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

    // Drag and drop scroll
    let pos = { top: 0, left: 0, x: 0, y: 0 };

    // Dynamic css values
    let cssvars = $derived({'viewer-padding': `${$ViewerPadding}em`});
    let cssVarStyles = $derived(Object.entries(cssvars)
        .map(([key, value]) => `--${key}:${value}`)
        .join(';'));

    // Entering wide mode : scroll to image
    $effect(() => {
         if (wide) {
            if (currentImageIndex != -1) {
                // delay because of smooth transition
                setTimeout(() => {
                    const targetScrollImage =
                        viewer.querySelectorAll('ImageViewer>img')[
                            currentImageIndex
                        ];
                    targetScrollImage?.scrollIntoView({
                        behavior: 'smooth',
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
</script>

<div
    id="ImageViewer"
    bind:this={viewer}
    role="button"
    tabindex="-1"
    ondblclick={() => toggleFullScreen()}
    transition:fade
    class="{wide ? 'wide' : 'thumbnail'} {$ViewerMode} {$ViewerReverseDirection
        ? 'reverse'
        : ''}"
    style={cssVarStyles}
    use:dragscroll={{ axis: 'both' }}
>
    {#if wide}
        <ImageViewerWideSettings
            {item}
            {onNextItem}
            {onPreviousItem}
            onClose={viewerclose}
        />
    {/if}
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
            onclick={() => {
                currentImageIndex = index;
                wide = true;
            }}
            in:send={{ key: index }}
            out:receive={{ key: index }}
        >
            <Image
                class={wide ? 'wide' : 'thumbnail'}
                alt="content_{index}"
                page={content}
            />
        </button>
    {/each}
</div>
{#if autoNextItem && $selectedItemNext !== undefined}
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
    #ImageViewer.thumbnail {
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
    }

    #ImageViewer.thumbnail :global(.imgpreview) {
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
</style>
