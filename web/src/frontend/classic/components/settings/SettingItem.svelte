<script lang="ts">
    import { Tooltip } from 'carbon-components-svelte';
    
    interface Props {
        labelText?: string;
        helperText?: string;
        type?: 'sub-menu' | 'item';
    }
    let { labelText = '', helperText = '', type = 'item' }: Props = $props();
</script>

<div class={`menu-left-panel-${type}-container`}>
    {#if type === 'item'}
        <Tooltip triggerText={labelText} align="start">
            <p>{helperText}</p>
        </Tooltip>
    {/if}

    <slot />
</div>

<style>
    .menu-left-panel-item-container {
        padding-left: 2rem;
        padding-right: 2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .menu-left-panel-sub-menu-container {
        padding-left: 2rem;
    }
</style>
