<script lang="ts">
    import { NumberInput } from 'carbon-components-svelte';
    import type { Numeric } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Numeric;
    let current: Numeric;
    let value: number;

    $: Update(setting);

    function Update(setting: Numeric) {
        if (current === setting) {
            return;
        }
        if (current) {
            current.ValueChanged.Unsubscribe(OnValueChangedCallback);
        }
        if (setting) {
            setting.ValueChanged.Subscribe(OnValueChangedCallback);
        }
        value = setting.Value;
        current = setting;
    }

    function OnValueChangedCallback(sender: Numeric, args: number) {
        if (sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
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
