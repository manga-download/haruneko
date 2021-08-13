<script lang="ts">
    import { Toggle } from "carbon-components-svelte";
    export let defaultValue: boolean;
    export let onToggle: () => void;
</script>

<Toggle toggled={defaultValue} on:toggle={() => onToggle()} />
