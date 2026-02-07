<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { TextInput } from 'carbon-components-svelte';
    import type { Text } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';
    import SettingItem from './SettingItem.svelte';

    export let setting: Text;
    let value: string = setting.Value;

    $: setting.Value = value;

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });

    function OnValueChanged(newValue: string) {
        value = newValue;
    }
</script>

<SettingItem
    labelText={GlobalSettings.Locale[setting.Label]()}
    helperText={GlobalSettings.Locale[setting.Description]()}
>
    <TextInput bind:value />
</SettingItem>
