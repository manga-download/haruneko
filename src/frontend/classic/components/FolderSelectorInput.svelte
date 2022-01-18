<script lang="ts">
    import type { SettingValidator } from "../utils/storage";
    import type { Writable } from "svelte/store";
    import { TextInput } from "carbon-components-svelte";
    import { updateStoreValue } from "../utils/storage";

    export let labelText = "Select directory";
    export let storageKey: string | undefined = undefined;
    export let validator: SettingValidator = undefined;
    export let componentId: string;
    export let store: Writable<string | number>;

    let storeValue = String($store);
</script>

<div>
    <TextInput readonly value={storeValue} />
    <label for={`folder-selector-${componentId}`}>{labelText}</label>
    <input
        id={`folder-selector-${componentId}`}
        type="file"
        bind:value={storeValue}
        on:change={() => {
            if (storageKey) {
                updateStoreValue(store, storageKey, storeValue, validator);
            }
        }}
    />
</div>

<style>
    input[type="file"] {
        display: none;
    }

    label {
        display: inline-block;
        margin-top: 1rem;
        cursor: pointer;
    }
</style>
