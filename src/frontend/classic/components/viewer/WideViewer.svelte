<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import type { IMediaContainer } from '../../../../engine/providers/MediaPlugin';
    import WideViewerSetting from './WideViewerSetting.svelte';
    import WebtoonViewer from './WebtoonViewer.svelte';
    import MangaViewer from './MangaViewer.svelte';
    import { Key, ViewerModeValue } from '../../stores/Settings';
    import { ViewerPadding, ViewerZoom } from '../../stores/Settings';

    export let item: IMediaContainer;
    export let currentImageIndex: number;

    const title = item?.Parent?.Title ?? 'unkown';

    let autoNextChapter = false;
    let viewer: HTMLElement;

    function onKeyDown(event) {
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
                ViewerZoom.set(100);
                break;
            case event.key === '/' && !event.ctrlKey:
                ViewerZoom.reset();
                break;
            case event.key === '+' && !event.ctrlKey:
                ViewerZoom.increment();
                break;
            case event.key === '-' && !event.ctrlKey:
                if ($ViewerZoom > 15) ViewerZoom.decrement();
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
                scrollMagic(viewer, window.innerHeight * 0.8);
                break;
            default:
                break;
        }
    }

    function scrollSmoothly(element, distance) {
        const speed = Math.abs(Math.floor(distance / 10)),
            end = Math.abs(distance % speed);
        function doTinyScroll() {
            if (Math.abs(distance) == end) return;
            else if (distance > 0) {
                element.scrollBy({
                    top: speed,
                });
                distance -= speed;
            } else {
                element.scrollBy({
                    top: -speed,
                });
                distance += speed;
            }
            window.requestAnimationFrame(doTinyScroll);
        }
        window.requestAnimationFrame(doTinyScroll);
    }

    /**
     * Dynamically change the scrolling to stop at the end of images or skip to the start of the next image
     */
    function scrollMagic(element: HTMLElement, defaultDistance: number) {
        let images = element.querySelectorAll('.image');
        // Are we at the end of the page
        if (
            images[images.length - 1].getBoundingClientRect().bottom -
                window.innerHeight <
            1
        ) {
            // Should we go to next chapter because we previouysly reached the end of page ?
            if (autoNextChapter) {
                return this.requestChapterUp();
            }
            // Prepare for next chapter
            autoNextChapter = true;

            // Todo: Find a way to popup that you have to press spacebar again within 4s
            setTimeout(function () {
                autoNextChapter = false;
            }, 4000);
            return;
        }
        // Lets stay on current page
        // Find current image within view
        let targetScrollImages = [...images].filter((image) => {
            let rect = image.getBoundingClientRect();
            return rect.top <= window.innerHeight && rect.bottom > 1;
        });

        // If multiple images filtered, get the last one. If none scroll use the top image
        let targetScrollImage =
            targetScrollImages[targetScrollImages.length - 1] || images[0];

        // Is the target image top within view ? then scroll to the top of it
        if (targetScrollImage.getBoundingClientRect().top > 1) {
            // Scroll to it
            targetScrollImage.scrollIntoView({
                behavior: 'smooth',
            });
        }
        // Do we stay within target ? (bottom is further than current view)
        else if (
            window.innerHeight + 1 <
            targetScrollImage.getBoundingClientRect().bottom
        ) {
            element.scrollBy({
                top: Math.min(
                    defaultDistance,
                    targetScrollImage.getBoundingClientRect().bottom -
                        window.innerHeight
                ),
                left: 0,
                behavior: 'smooth',
            });
        }
        // We have to try to get to next image
        else {
            // Find next image
            let nextScrollImage = targetScrollImage.nextElementSibling;
            // Scroll to it
            nextScrollImage.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<div bind:this={viewer} class={$ViewerModeValue}>
    <WideViewerSetting {title} on:close />
    {#if $ViewerModeValue === Key.ViewerMode_Longstrip}
        <WebtoonViewer {item} />
    {:else if $ViewerModeValue === Key.ViewerMode_Paginated}
        <MangaViewer {item} {currentImageIndex} />
    {/if}
</div>

<style>
    div {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        overflow-y: scroll;
        z-index: 9000;
        background-color: var(--cds-ui-01);
        cursor: grab;
    }

    /*  FIXME: For robustness this should be Key.ViewerMode_Paginated */
    .paginated {
        display: flex;
        align-items: center;
    }
</style>
