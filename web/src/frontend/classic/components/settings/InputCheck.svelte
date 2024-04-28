<script lang="ts">
    import { onMount } from 'svelte';
    import { Toggle } from 'carbon-components-svelte';
    import type { Check } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Check;
    let current: Check;
    let value: boolean;

    onMount(() => {
        return () => {
            current?.Unsubscribe(OnValueChangedCallback);
        };
    });

    $: Update(setting);

    function Update(setting: Check) {
        if (current !== setting) {
            current?.Unsubscribe(OnValueChangedCallback);
            setting?.Subscribe(OnValueChangedCallback);
            value = setting.Value;
            current = setting;
        }
    }

    function OnValueChangedCallback(val: boolean) {
        value = val;
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <Toggle
        toggled={value}
        on:toggle={(evt) => (setting.Value = evt.detail.toggled)}
    />
</SettingItem>
