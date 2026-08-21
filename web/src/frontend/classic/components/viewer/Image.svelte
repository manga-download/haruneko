<script lang="ts">

    import { onDestroy } from 'svelte';
    import type { MediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { ContextMenu, ContextMenuOption, InlineLoading } from 'carbon-components-svelte';
    import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
    import Save from 'carbon-icons-svelte/lib/Save.svelte';
    interface Props {
        page: MediaItem;
        alt: string;
        wide: boolean;
    }

    let { page, alt, wide}: Props = $props();
    let dataload: Promise<Blob> = $derived(page.Fetch(Priority.High, new AbortController().signal));
    let image: HTMLImageElement = $state();

    onDestroy(() => {
        dataload.then((_src) => {
            URL.revokeObjectURL(image?.src);
        });
    });

    function downloadImage(data: Blob) {
        const extension = data.type.split('/')[1]?.split('+')[0] || 'image';
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `image.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function copyImage(data: Blob) {
        const png = data.type === 'image/png' ? data : new Promise<Blob>((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext('2d')?.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Unable to copy image'));
                }
            }, 'image/png');
        });
        return navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    }

</script>

{#await dataload}
    <InlineLoading class="imgpreview center " on:click />
{:then data}
    {#if data?.type.startsWith('image')}
        <img
            class="imgpreview"
            alt={page ? alt : ''}
            src={URL.createObjectURL(data)}
            class:wide={wide}
            draggable="false"
            bind:this={image}
        />
        <ContextMenu target={[image]}>
            <ContextMenuOption icon={Save} labelText="Save image" onclick={() => downloadImage(data)} />
            <ContextMenuOption icon={Copy} labelText="Copy image" onclick={() => copyImage(data)} />
        </ContextMenu>
    {:else}
        <InlineLoading
            class="imgpreview center"
            status="error"
            description="Resource is not an image"
            on:click
        />
    {/if}
{:catch error}
    <InlineLoading
        class="imgpreview"
        status="error"
        description={error}
        on:click
    />
{/await}

<style>
    img {
        display: flex;
        transition: width 100ms ease-in-out;
        transition: height 100ms ease-in-out;
    }
    img.wide {
        transition: width 200ms ease-in-out;
        transition: height 200ms ease-in-out;
    }

</style>
