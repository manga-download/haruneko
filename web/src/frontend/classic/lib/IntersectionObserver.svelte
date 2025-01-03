<script lang="ts"> 
    import { onDestroy,onMount } from 'svelte';

    let { 
        observer,
        display=false,
        dataid,
        children,
        placeholder=undefined,
    } = $props();

    let div : HTMLElement;
    onMount(() => {
        observer.observe(div);
    });
    onDestroy(() => {
        observer.unobserve(div);
    })
</script>

<div bind:this={div} data-id={dataid}>
    {#if display}
        {@render children()}
    {:else}
        {@render placeholder()}
    {/if}
</div>