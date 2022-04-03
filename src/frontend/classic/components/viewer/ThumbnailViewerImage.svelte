<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { IMediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';

    export let page: IMediaItem;
    export let handleClick: () => void;
    export let title: string;

    const spinner = 'https://gifimage.net/wp-content/uploads/2017/08/spinner-gif-13.gif';
    const error = 'https://cms-assets.tutsplus.com/uploads/users/30/posts/23176/image/final-grey-2.png';

    function mountThumbnail(element: HTMLDivElement, page: IMediaItem) {
        updateThumbnail(element, page);
        return {
            update: (page: IMediaItem) => updateThumbnail(element, page),
            destroy: () => unmountThumbnail(element)
        };
    }

    function unmountThumbnail(element: HTMLDivElement) {
        const url = element.style.backgroundImage.replace(/(url\(['"]?|['"]?\))/g, '');
        if(url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    }

    async function updateThumbnail(element: HTMLDivElement, page: IMediaItem) {
        try {
            unmountThumbnail(element);
            const data = await page.Fetch(Priority.High);
            element.style.backgroundImage = `url('${URL.createObjectURL(data)}')`;
        } catch {
            element.style.backgroundImage = `url('${error}')`;
        }
    }
</script>

<div
    class="thumbnail"
    style="background-image: url('{spinner}');"
    on:click={handleClick}
    {title}
    in:fly
    use:mountThumbnail={page}
/>

<style>
    .thumbnail {
        display: inline-block;
        border: 2px solid var(--cds-ui-04);
        background-color: var(--cds-ui-01);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 1em;
        margin: 0.5em;
        width: 16em;
        height: 16em;
        cursor: pointer;
        box-shadow: 1em 1em 2em var(--cds-ui-01);
    }
</style>
