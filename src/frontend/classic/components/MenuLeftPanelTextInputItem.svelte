<script lang="ts">
    import { TextInput } from "carbon-components-svelte";
    export let labelText: string;
    export let placeholder: string;
    export let helperText: string = "";
    export let defaultValue: string = "";
</script>

<TextInput {labelText} {helperText} {placeholder} value={defaultValue} />

<style>
</style>
