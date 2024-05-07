<script lang="ts">
    import { onMount } from 'svelte';
    import { NumberInput } from 'carbon-components-svelte';
    import type { Numeric } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Numeric;
    let current: Numeric;
    let value: number;

    onMount(() => {
        return () => {
            current?.Unsubscribe(OnValueChangedCallback);
        };
    });

    $: Update(setting);

    function Update(setting: Numeric) {
        if (current !== setting) {
            current?.Unsubscribe(OnValueChangedCallback);
            setting?.Subscribe(OnValueChangedCallback);
            value = setting.Value;
            current = setting;
        }
    }

    function OnValueChangedCallback(val: number) {
        value = val;
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <NumberInput
        {value}
        min={setting.Min}
        max={setting.Max}
        on:change={(event) => (setting.Value = event.detail)}
    />
</SettingItem>
