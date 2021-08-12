<script>
    import { SideNavDivider } from "carbon-components-svelte";
</script>

<div class="menu-left-panel-item-container">
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
