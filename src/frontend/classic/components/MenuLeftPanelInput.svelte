<script lang="ts">
    import {
        TextInput,
        NumberInput,
        PasswordInput,
    } from "carbon-components-svelte";
    import FolderSelectorInput from "./FolderSelectorInput.svelte";
    export let placeholder: string = "";
    export let defaultValue: string | number = "";
    export let type: "number" | "text" | "file" | "password" = "text";
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;
</script>

<div class="text-input-wrapper">
    {#if type === "text"}
        <TextInput {placeholder} value={defaultValue} />
    {:else if type === "number"}
        <NumberInput value={defaultValue} {min} {max} />
    {:else if type === "file"}
        <FolderSelectorInput />
    {:else if type === "password"}
        <PasswordInput hideLabel value={defaultValue} placeholder="Password" />
    {/if}
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
