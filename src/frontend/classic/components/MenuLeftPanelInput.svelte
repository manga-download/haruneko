<script lang="ts">
    import { TextInput, NumberInput } from "carbon-components-svelte";
    export let placeholder: string;
    export let defaultValue: string | number = "";
    export let type: "number" | "text" = "text";
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;
</script>

<div class="text-input-wrapper">
    {#if type === "text"}
        <TextInput {placeholder} value={defaultValue} />
    {:else if type === "number"}
        <NumberInput value={defaultValue} {min} {max} />
    {/if}
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
