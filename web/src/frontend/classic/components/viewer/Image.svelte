<script lang="ts">

    import { onDestroy } from 'svelte';
    import type { MediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
    interface Props {
        page: MediaItem;
        alt: string;
        class: string
    }

    let { page, alt, class: className = '' }: Props = $props();
    let loaded = $state(false);
    let dataload: Promise<Blob> = $derived(page.Fetch(Priority.High, new AbortController().signal));
    let image: HTMLImageElement = $state();

    onDestroy(() => {
        dataload.then((_src) => {
            URL.revokeObjectURL(image?.src);
        });
    });

    import { Settings } from '../../stores/Settings.svelte';

    $effect(() => {
        if (loaded) {
            image.width = image.naturalWidth * Settings.ViewerZoomRatio;
            image.height = image.naturalHeight * Settings.ViewerZoomRatio;
        } 
    });

</script>

{#await dataload}
    <InlineLoading class="imgpreview center {className}" on:click />
{:then data}
    {#if data?.type.startsWith('image')}
        <img
            class="imgpreview {className}"
            alt={page ? alt : ''}
            src={URL.createObjectURL(data)}
            draggable="false"
            bind:this={image}
            onload={() => (loaded = true)}
        />
    {:else}
        <InlineLoading
            class="imgpreview center {className}"
            status="error"
            description="Resource is not an image"
            on:click
        />
    {/if}
{:catch error}
    <InlineLoading
        class="imgpreview {className}"
        status="error"
        description={error}
        on:click
    />
{/await}

<style>
    img {
        display: flex;
    }
    img.wide {
        transition: width 200ms ease-in-out;
        transition: height 200ms ease-in-out;
    }
    img.thumbnail {
        transition: width 100ms ease-in-out;
        transition: height 100ms ease-in-out;
    }
</style>
