<script lang="ts">
    import { Toggle } from "carbon-components-svelte";
    export let defaultValue: boolean;
</script>

<Toggle toggled={defaultValue} />
