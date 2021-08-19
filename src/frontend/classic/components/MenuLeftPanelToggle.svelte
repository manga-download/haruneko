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
    export let passNewValueToExtras: boolean = false;

    let toggled: boolean = castBooleanSetting(defaultValue);
    const validator: SettingValidator = undefined;
</script>

<Toggle
    {toggled}
    on:toggle={({ detail }) => {
        const newValue = detail.toggled;
        const extrasArg = passNewValueToExtras ? newValue : undefined;
        onSettingChange(storageKey, newValue, validator, extras, extrasArg);
        toggled = newValue;
    }}
/>
