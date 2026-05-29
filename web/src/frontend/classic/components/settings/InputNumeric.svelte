<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { NumberInput } from 'carbon-components-svelte';
    import type { Numeric } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';
    import SettingItem from './SettingItem.svelte';

    export let setting: Numeric;
    let value: number = setting.Value;

    $: setting.Value = value;

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });

    function OnValueChanged(newValue: number) {
        value = newValue;
    }
</script>

<SettingItem
    labelText={GlobalSettings.Locale[setting.Label]()}
    helperText={GlobalSettings.Locale[setting.Description]()}
>
    <NumberInput bind:value min={setting.Min} max={setting.Max} />
</SettingItem>
