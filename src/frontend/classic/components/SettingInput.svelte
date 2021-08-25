<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { SettingValidator } from "../utils/storage";
    import {
        TextInput,
        NumberInput,
        PasswordInput,
    } from "carbon-components-svelte";
    import { updateStoreValue } from "../utils/storage";
    import FolderSelectorInput from "./FolderSelectorInput.svelte";

    export let store: Writable<string | number>;
    export let storageKey: string;
    export let validator: SettingValidator = undefined;
    export let placeholder: string = "";
    export let type: "number" | "text" | "file" | "password" = "text";
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;

    let storeValue = $store;
</script>

<div class="text-input-wrapper">
    {#if type === "text"}
        <TextInput
            {placeholder}
            bind:value={storeValue}
            on:change={() =>
                updateStoreValue(store, storageKey, storeValue, validator)}
        />
    {:else if type === "number"}
        <NumberInput
            bind:value={storeValue}
            {min}
            {max}
            on:change={() =>
                updateStoreValue(store, storageKey, storeValue, validator)}
        />
    {:else if type === "file"}
        <FolderSelectorInput {storageKey} {store} componentId={storageKey} />
    {:else if type === "password"}
        <PasswordInput
            hideLabel
            bind:value={storeValue}
            placeholder="Password"
            on:change={() =>
                updateStoreValue(store, storageKey, storeValue, validator)}
        />
    {/if}
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
