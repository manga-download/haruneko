<script lang="ts">
    import { Toggle } from "carbon-components-svelte";

    export let labelText: string;
    export let defaultValue: boolean;
</script>

<Toggle {labelText} toggled={defaultValue} />
