<script lang="ts">
    import { Toggle } from "carbon-components-svelte";
    import type {
        SettingExtras,
        SettingValidator,
        SettingValue,
    } from "../utils/storage";
    import { onSettingChange, castBooleanSetting } from "../utils/storage";

    export let defaultValue: SettingValue;
    export let storageKey: string;
    export let extras: SettingExtras = undefined;

    let toggled: boolean = castBooleanSetting(defaultValue);
    const validator: SettingValidator = undefined;
</script>

<Toggle
    {toggled}
    on:toggle={({ detail }) => {
        const newValue = detail.toggled;
        onSettingChange(storageKey, newValue, extras, validator);
        toggled = newValue;
    }}
/>
