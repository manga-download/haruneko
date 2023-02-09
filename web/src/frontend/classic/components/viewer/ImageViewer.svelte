<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';
    const dispatch = createEventDispatcher();
    // UI
    import { InlineNotification } from 'carbon-components-svelte';
    // engine
    import type { IMediaContainer,IMediaItem } from '../../../../engine/providers/MediaPlugin';
    // svelte component
    import ImageViewerWideSettings from './ImageViewerWideSettings.svelte';
    import Image from './Image.svelte';
    // stores
    import { Key, ViewerModeValue, ViewerPadding, ViewerZoom, ViewerReverseDirectionValue } from '../../stores/Settings';
    import { selectedItemNext } from '../../stores/Stores';
    // others
    import { scrollSmoothly, scrollMagic } from './utilities';

    export let item: IMediaContainer;
    export let currentImageIndex: number=-1;
    export let wide:Boolean;

	onDestroy(() => {
        document.removeEventListener('keydown', onKeyDown);
        viewer?.removeEventListener('mousedown', onMouseDown);
	});

    $: entries = item.Entries as IMediaItem[];

    const title = item?.Title ?? 'unkown';
    let viewer: HTMLElement;

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
            case event.code === 'ArrowRight' :
                dispatch('nextItem');
                break;
            case event.code === 'ArrowLeft':
                dispatch('previousItem');
                break;
            case event.key === '*':
                $ViewerZoom = 100;
                break;
            case event.key === '/' :
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
            case event.code === 'Escape':
                wide = false;
                break;
            case event.code === 'Space':
                scrollMagic(
                    viewer,
                    '.viewerimage',
                    window.innerHeight * 0.8,
                    onNextItemCallback
                );
                break;
            default:
                break;
        }
    }

    let previousOffset = { x : 0, y : 0 };
    let previousSize = { width : 0, height : 0 };

    /**
     *
     */
    function zoomIn() {
        observeZoom();
        ViewerZoom.increment();
    }

    /**
     *
     */
    function zoomOut() {
        observeZoom();
        ViewerZoom.decrement();
    }

    const zoomObserver = new ResizeObserver(function () {
        switch ($ViewerModeValue){
            case Key.ViewerMode_Longstrip : {
                viewer.scrollTo({
                    top: viewer.scrollHeight * (previousOffset.y/ previousSize.height),
                    behavior: 'smooth'
                });
                break;
            }
            case Key.ViewerMode_Paginated: {
                viewer.scrollTo({
                    left: viewer.scrollWidth * (previousOffset.x/ previousSize.width),
                    behavior: 'smooth'
                });
                break;
            }
        }
    });

    function observeZoom() {
        previousOffset = { x : viewer.scrollTop, y : viewer.scrollLeft };
        previousSize = { width: viewer.scrollWidth, height : viewer.scrollHeight };
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

    function onMouseDown(e: MouseEvent) {
        
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

        viewer.addEventListener('mousemove', onMouseMove);
        viewer.addEventListener('mouseup', onMouseUp);
    }

    const onMouseMove = function (e: MouseEvent) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        viewer.scrollTop = pos.top - dy;
        viewer.scrollLeft = pos.left - dx;
    };

    const onMouseUp = function () {
        viewer.removeEventListener('mousemove', onMouseMove);
        viewer.removeEventListener('mouseup', onMouseUp);

        viewer.style.cursor = 'grab';
        viewer.style.removeProperty('user-select');
    };

	$: cssvars = {
		'viewer-padding': `${$ViewerPadding}em`,
	};
    $: cssVarStyles = Object.entries(cssvars)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	$: if (wide) {
            if(currentImageIndex != -1) {
                // delay because of smooth transition
                setTimeout(() => {
                    const targetScrollImage = viewer.querySelectorAll('ImageViewer>img')[currentImageIndex];
                    targetScrollImage?.scrollIntoView({behavior: 'smooth', inline:'center'});
                    currentImageIndex=-1;
                }, 200);
            }
            document.addEventListener('keydown', onKeyDown);
            viewer?.addEventListener('mousedown', onMouseDown); 
        }
        else {
            document.removeEventListener('keydown', onKeyDown);
            viewer?.removeEventListener('mousedown', onMouseDown);
            if(viewer) viewer.style.userSelect = 'none';
        }
</script>
<div id="ImageViewer" bind:this={viewer} class="{wide?'wide':'thumbnail'} {$ViewerModeValue} {$ViewerReverseDirectionValue ? 'reverse':''}" style="{cssVarStyles}">
    {#if wide}
        <ImageViewerWideSettings {title} on:nextItem on:previousItem on:close={() => wide = false} />
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

    {#each entries as content, index}
        <Image class="{wide?'wide':'thumbnail'}" alt="content_{index}" page={content}
            on:click={() => {currentImageIndex = index; wide=true; }}
        />
    {/each}
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

    #ImageViewer.thumbnail
    {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        text-align: center;
    }

    #ImageViewer.thumbnail :global(img) {
        display: inline-block;
        border: 2px solid var(--cds-ui-04);
        background-color: var(--cds-ui-01);
        border-radius: 1em;
        margin: 0.5em;
        width: 16em;
        height: 16em;
        cursor: pointer;
        box-shadow: 1em 1em 2em var(--cds-ui-01);
        object-fit: contain;
    }

    #ImageViewer.wide {
        overflow: auto;
        background-color: var(--cds-ui-01);
        cursor: grab;
        width:100%;
        height: 100%;
        align-items:center;
        transition: gap 0.2s ease-in-out;
        gap: var(--viewer-padding);
        min-width: 0;
        min-height: 0;
    }
    #ImageViewer.wide.longstrip {
        display: flex;
        flex-direction: column;
        overflow-y:auto;

    }
    #ImageViewer.wide.paginated {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height:100%;
        overflow-x:auto;
    }
    /* TODO: implement RTL reading */
    #ImageViewer.wide.paginated.reverse {
        flex-flow: row-reverse;
    }
</style>
