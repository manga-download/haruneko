<script lang="ts">
    import { TextInput } from "carbon-components-svelte";
    export let placeholder: string;
    export let defaultValue: string = "";
</script>

<div class="text-input-wrapper">
    <TextInput {placeholder} value={defaultValue} />
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
