<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { InlineNotification } from 'carbon-components-svelte';

    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import WideViewerSetting from './WideViewerSetting.svelte';
    import WebtoonViewer from './WebtoonViewer.svelte';
    import MangaViewer from './MangaViewer.svelte';
    import { Key, ViewerMode, ViewerModeValue } from '../../stores/Settings';
    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';
    import { scrollSmoothly, scrollMagic } from './utilities';
    import { selectedItemNext } from '../../stores/Stores';
    export let item: IMediaContainer;
    export let currentImageIndex: number;

    const title = item?.Title ?? 'unkown';

    let viewer: HTMLElement;
    // TODO: remove next line, it's a temp fix, the settings is getting lost on some reloads
    ViewerMode.Value = Key.ViewerMode_Longstrip;

    function onKeyDown(event: KeyboardEvent) {
        switch (true) {
            case event.code === 'ArrowUp' && !event.ctrlKey:
                scrollSmoothly(viewer, -64);
                break;
            case event.code === 'ArrowDown' && !event.ctrlKey:
                scrollSmoothly(viewer, 64);
                break;
            case event.code === 'PageUp' && !event.ctrlKey:
                viewer.scrollBy({
                    top: -window.innerHeight * 0.95,
                    left: 0,
                    behavior: 'smooth',
                });
                break;
            case event.code === 'PageDown' && !event.ctrlKey:
                viewer.scrollBy({
                    top: window.innerHeight * 0.95,
                    left: 0,
                    behavior: 'smooth',
                });
                break;
            case event.code === 'ArrowRight' && !event.ctrlKey:
                dispatch('nextItem');
                break;
            case event.code === 'ArrowLeft' && !event.ctrlKey:
                dispatch('previousItem');
                break;
            case event.key === '*' && !event.ctrlKey:
                $ViewerZoom = 100;
                break;
            case event.key === '/' && !event.ctrlKey:
                ViewerZoom.reset();
                break;
            case event.key === '+' && !event.ctrlKey:
                zoomIn();
                break;
            case event.key === '-' && !event.ctrlKey:
                zoomOut();
                break;
            case event.key === '+' && event.ctrlKey:
                ViewerPadding.increment();
                break;
            case event.key === '-' && event.ctrlKey:
                ViewerPadding.decrement();
                break;
            case event.code === 'Escape' && !event.ctrlKey:
                dispatch('close');
                break;
            case event.code === 'Space' && !event.ctrlKey:
                scrollMagic(
                    viewer,
                    window.innerHeight * 0.8,
                    onNextItemCallback
                );
                break;
            default:
                break;
        }
    }

    /**
     *
     */
    function zoomIn() {
        previousOffset = viewer.scrollTop;
        previousHeight = viewer.scrollHeight;
        observeZoom();
        ViewerZoom.increment();
    }

    /**
     *
     */
    function zoomOut() {
        if ($ViewerZoom > 15) {
            previousOffset = viewer.scrollTop;
            previousHeight = viewer.scrollHeight;
            observeZoom();
            ViewerZoom.decrement();
        }
    }

    let previousOffset = 0;
    let previousHeight = 0;

    const zoomObserver = new ResizeObserver(function () {
        if (viewer)
            viewer.scrollTop =
                viewer.scrollHeight * (previousOffset / previousHeight);
    });

    function observeZoom() {
        zoomObserver.disconnect();
        // We observe the size of all children to detect the full container scrollHeight change
        for (var i = 0; i < viewer.children.length; i++) {
            zoomObserver.observe(viewer.children[i]);
        }
    }

    let autoNextItem = false;
    function onNextItemCallback() {
        if (autoNextItem && selectedItemNext) dispatch('nextItem');
        else {
            autoNextItem = true;
            setTimeout(function () {
                autoNextItem = false;
            }, 4000);
        }
    }

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    function mouseDownHandler(e: MouseEvent) {
        viewer.style.cursor = 'grabbing';
        viewer.style.userSelect = 'none';
        pos = {
            // The current scroll
            left: viewer.scrollLeft,
            top: viewer.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        viewer.addEventListener('mousemove', mouseMoveHandler);
        viewer.addEventListener('mouseup', mouseUpHandler);
    }

    const mouseMoveHandler = function (e: MouseEvent) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        viewer.scrollTop = pos.top - dy;
        viewer.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        viewer.removeEventListener('mousemove', mouseMoveHandler);
        viewer.removeEventListener('mouseup', mouseUpHandler);

        viewer.style.cursor = 'grab';
        viewer.style.removeProperty('user-select');
    };
</script>

<svelte:window on:keydown={onKeyDown} on:mousedown={mouseDownHandler} />
<div id="wideviewer" bind:this={viewer} class={$ViewerModeValue}>
    <WideViewerSetting {title} on:nextItem on:previousItem on:close />
    {#if $ViewerModeValue === Key.ViewerMode_Longstrip}
        <WebtoonViewer {item} />
    {:else if $ViewerModeValue === Key.ViewerMode_Paginated}
        <MangaViewer {item} {currentImageIndex} />
    {/if}
    {#if autoNextItem && $selectedItemNext !== undefined}
        <InlineNotification
            kind="info"
            title="Bottom reached"
            subtitle="Click or Press space again to go to next item."
            on:click={() => dispatch('nextitem')}
            on:close={() => (autoNextItem = false)}
            style="z-index: 10000; position: fixed; bottom: 2em; right: 2em;"
        />
    {/if}
</div>

<style>
    #wideviewer {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        overflow-y: scroll;
        z-index: 10000;
        background-color: var(--cds-ui-01);
        cursor: grab;
    }

    /*  FIXME: For robustness this should be Key.ViewerMode_Paginated */
    .paginated {
        display: flex;
        align-items: center;
    }
</style>
