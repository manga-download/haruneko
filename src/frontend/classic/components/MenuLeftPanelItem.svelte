<script lang="ts">
    import { SideNavDivider, Tooltip } from "carbon-components-svelte";
    export let labelText: string;
    export let helperText: string;
</script>

<div class="menu-left-panel-item-container">
    <Tooltip triggerText={labelText} align="start">
        <p>{helperText}</p>
    </Tooltip>
    <slot />
</div>
<SideNavDivider />

<style>
    .menu-left-panel-item-container {
        padding-left: 2rem;
        padding-right: 2rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
</style>
