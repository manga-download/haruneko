<script lang="ts">
    import { TextInput } from 'carbon-components-svelte';
    import type { Text } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Text;
    let current: Text;
    let value: string;

    $: Update(setting);

    function Update(setting: Text) {
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

    function OnValueChangedCallback(sender: Text, args: string) {
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
    <TextInput
        {value}
        on:change={(event) => (setting.Value = event.currentTarget['value'])}
    />
</SettingItem>
