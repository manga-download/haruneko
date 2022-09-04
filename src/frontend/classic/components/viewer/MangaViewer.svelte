<script lang="ts">
    import type {
        IMediaContainer,
        IMediaItem,
    } from '../../../../engine/providers/MediaPlugin';
    import WideViewerImage from './WideViewerImage.svelte';
    import { onMount } from 'svelte';
    import {
        ViewerDoublePageValue,
        ViewerReverseDirectionValue,
        ViewerPadding,
    } from '../../stores/Settings';

    type ChapterImage = { current: IMediaItem; next: IMediaItem | undefined };

    export let item: IMediaContainer;
    export let currentImageIndex: number;

    let chapterImages: ChapterImage[] = [];
    /*const carbonLgBreakpoint = 1056;
    const carbonMaxBreakpoint = 1584;
    const minImageWidth = 50;
    const maxImageWidth = 100;
    let imageWidth: number;*/

    const handleKeyDown = (evt: KeyboardEvent) => {
        if (
            (!$ViewerReverseDirectionValue && evt.key === 'ArrowRight') ||
            ($ViewerReverseDirectionValue && evt.key === 'ArrowLeft')
        ) {
            incrementCurrentImage();
        } else if (
            (!$ViewerReverseDirectionValue && evt.key === 'ArrowLeft') ||
            ($ViewerReverseDirectionValue && evt.key === 'ArrowRight')
        ) {
            decrementCurrentImage();
        }
    };

    const incrementCurrentImage = () => {
        if (chapterImages && currentImageIndex < chapterImages.length - 1) {
            currentImageIndex += 1;
        }
    };

    const decrementCurrentImage = () => {
        if (currentImageIndex > 0) {
            currentImageIndex -= 1;
        }
    };

    const setImageWidth = () => {
        /*
        const winWidth = nw.Window.get().width;

        if (winWidth < carbonLgBreakpoint) {
            imageWidth = maxImageWidth;
        } else if (winWidth > carbonMaxBreakpoint) {
            imageWidth = minImageWidth;
        } else {
            // smooth transition from 100% to 50%
            imageWidth =
                ((maxImageWidth - minImageWidth) /
                    (carbonLgBreakpoint - carbonMaxBreakpoint)) *
                    (winWidth - carbonLgBreakpoint) +
                maxImageWidth;
        }
        */
    };

    onMount(async () => {
        await item.Update();
        let pages: ChapterImage[] = [];
        let increment = $ViewerDoublePageValue ? 2 : 1;
        for (let index = 0; index < item.Entries.length; index += increment) {
            pages.push({
                current: item.Entries[index] as IMediaItem,
                next: $ViewerDoublePageValue
                    ? (item.Entries[index + 1] as IMediaItem)
                    : undefined,
            });
        }
        if ($ViewerDoublePageValue && item.Entries.length % increment > 0) {
            pages.push({
                current: item.Entries[item.Entries.length - 1] as IMediaItem,
                next: undefined,
            });
        }
        chapterImages = pages;
    });
</script>

<svelte:window
    on:keydown={(evt) => handleKeyDown(evt)}
    on:resize={() => setImageWidth()}
/>

{#each chapterImages as chapterImage, index}
    {#if chapterImage.next !== undefined}
        <div
            class={currentImageIndex === index && $ViewerReverseDirectionValue
                ? 'current is-inversed'
                : currentImageIndex === index
                ? 'current'
                : ''}
        >
            <WideViewerImage
                alt="content_{currentImageIndex}"
                page={chapterImage.current}
                class="manga-image double-page-image"
                style="padding-top: {$ViewerPadding}em; padding-bottom: {$ViewerPadding}em; padding-right: {$ViewerPadding}em; padding-left: {$ViewerPadding /
                    2}em;"
            />
            <WideViewerImage
                alt="content_{currentImageIndex}"
                page={chapterImage.next}
                class="manga-image double-page-image"
                style="padding-top: {$ViewerPadding}em; padding-bottom: {$ViewerPadding}em; padding-left: {$ViewerPadding}em; padding-right: {$ViewerPadding /
                    2}em;"
            />
        </div>
    {:else}
        <div class={currentImageIndex === index ? 'current' : ''}>
            <WideViewerImage
                alt="content_{currentImageIndex}"
                page={chapterImage.current}
                class="manga-image"
                style="padding: {$ViewerPadding}em; max-width: 100%; ;"
            />
        </div>
    {/if}
{/each}

<style>
    div {
        width: 100%;
        height: 100%;
        display: none;
    }

    .is-inversed {
        flex-flow: row-reverse;
    }

    .current {
        display: flex;
    }
</style>
