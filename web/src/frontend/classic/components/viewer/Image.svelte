<script lang="ts">

    import { onDestroy } from 'svelte';
    import type { MediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
    interface Props {
        page: MediaItem;
        alt: string;
        [key: string]: any
    }

    let { ...props }: Props = $props();
    let loaded = $state(false);
    let dataload: Promise<Blob> = $state();
    let image: HTMLImageElement = $state();
    dataload = props.page.Fetch(Priority.High, new AbortController().signal);

    onDestroy(() => {
        dataload.then((_src) => {
            URL.revokeObjectURL(image?.src);
        });
    });

    import { Settings } from '../../stores/Settings.svelte';

    $effect(() => {
        loaded ? (image.width = image.naturalWidth * Settings.ViewerZoomRatio) : 100;
    });
    $effect(() => {
        loaded ? (image.height = image.naturalHeight * Settings.ViewerZoomRatio) : 100;
    });
</script>

{#await dataload}
    <InlineLoading class="imgpreview center {props.class}" on:click />
{:then data}
    {#if data?.type.startsWith('image')}
        <img
            class="imgpreview {props.class}"
            alt={props.page ? props.alt : ''}
            src={URL.createObjectURL(data)}
            draggable="false"
            bind:this={image}
            onload={() => (loaded = true)}
        />
    {:else}
        <InlineLoading
            class="imgpreview center {props.class}"
            status="error"
            description="Resource is not an image"
            on:click
        />
    {/if}
{:catch error}
    <InlineLoading
        class="imgpreview {props.class}"
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
