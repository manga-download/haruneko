<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    import type {
        SettingExtras,
        SettingValidator,
        SettingValue,
    } from "../utils/storage";
    import { onSettingChange } from "../utils/storage";
    import type { Theme } from "./Theme.svelte";

    export let defaultValue: SettingValue;
    export let storageKey: string;
    export let extras: SettingExtras = undefined;
    export let validator: SettingValidator = undefined;
    export let passNewValueToExtras: boolean = false;
    export let items: Theme[];

    let selected: string = defaultValue as string;
</script>

<Select
    {selected}
    on:change={(e) => {
        const newValue = e.detail;
        const extrasArg = passNewValueToExtras ? newValue : undefined;
        onSettingChange(storageKey, newValue, validator, extras, extrasArg);
    }}
>
    {#each items as item}
        <SelectItem value={item.id} text={item.label} />
    {/each}
</Select>

<style>
</style>
