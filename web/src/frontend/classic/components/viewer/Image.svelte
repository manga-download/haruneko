<script lang="ts">

    import { onDestroy } from 'svelte';
    import type { MediaItem } from '../../../../engine/providers/MediaPlugin';
    import { Priority } from '../../../../engine/taskpool/DeferredTask';
    import { InlineLoading } from 'carbon-components-svelte';
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
