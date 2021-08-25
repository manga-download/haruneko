<script lang="ts">
    import type { SettingValidator } from "../utils/storage";
    import type { Writable } from "svelte/store";
    import { updateStoreValue } from "../utils/storage";
    import { Select, SelectItem } from "carbon-components-svelte";

    type SelectItem = {
        id: string;
        label: string;
    };

    export let store: Writable<string>;
    export let storageKey: string;
    export let validator: SettingValidator = undefined;
    export let items: SelectItem[];
</script>

<Select
    selected={$store}
    on:change={(evt) =>
        updateStoreValue(store, storageKey, evt.detail, validator)}
>
    {#each items as item}
        <SelectItem value={item.id} text={item.label} />
    {/each}
</Select>

<style>
</style>
