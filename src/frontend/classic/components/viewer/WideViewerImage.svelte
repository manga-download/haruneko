<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { IMediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';

    export let page: IMediaItem;
    export let alt: string;

    console.log($$restProps);

    const spinner = 'https://gifimage.net/wp-content/uploads/2017/08/spinner-gif-13.gif';
    const error = 'https://cms-assets.tutsplus.com/uploads/users/30/posts/23176/image/final-grey-2.png';

    function mountImage(element: HTMLImageElement, page: IMediaItem) {
        updateImage(element, page);
        return {
            update: (page: IMediaItem) => updateImage(element, page),
            destroy: () => unmountImage(element)
        };
    }

    function unmountImage(element: HTMLImageElement) {
        if(element.src && element.src.startsWith('blob:')) {
            URL.revokeObjectURL(element.src);
        }
    }

    async function updateImage(element: HTMLImageElement, page: IMediaItem) {
        try {
            unmountImage(element);
            const data = await page.Fetch(Priority.High);
            element.src = URL.createObjectURL(data);
        } catch {
            element.src = error;
        }
    }
</script>

<img
    alt={page ? alt : ''}
    class="image {$$restProps.class}"
    src={spinner}
    style={$$restProps.style}
    in:fly
    use:mountImage={page}
/>

<style>
    .image {
        display: block;
        margin-left: auto !important;
        margin-right: auto !important;
        /* background-color: azure; */
    }

    .double-page-image {
        width: 50%;
    }

    .manga-image {
        max-height: 100%;
    }
</style>
