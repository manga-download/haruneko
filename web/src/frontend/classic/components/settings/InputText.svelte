<script lang="ts">
    import { onMount } from 'svelte';
    import { TextInput } from 'carbon-components-svelte';
    import type { Text } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Text;
    let current: Text;
    let value: string;

    onMount(() => {
        return () => {
            current?.Unsubscribe(OnValueChangedCallback);
        };
    });

    $: Update(setting);

    function Update(setting: Text) {
        if (current !== setting) {
            current?.Unsubscribe(OnValueChangedCallback);
            setting?.Subscribe(OnValueChangedCallback);
            value = setting.Value;
            current = setting;
        }
    }

    function OnValueChangedCallback(val: string) {
        value = val;
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
