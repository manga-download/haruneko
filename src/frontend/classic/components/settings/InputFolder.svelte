<!--
<script lang="ts">
    export let labelText = "Select directory";
    export let componentId: string;
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
-->