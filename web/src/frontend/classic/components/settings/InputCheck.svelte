<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Toggle } from 'carbon-components-svelte';
    import type { Check } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Check;
    }
    let { setting = $bindable() }: Props = $props();

    let value: boolean = $state(setting.Value);

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });
    function OnValueChanged(newValue: boolean) {
        value = newValue;
    }
</script>

<SettingItem
    labelText={GlobalSettings.Locale[setting.Label]()}
    helperText={GlobalSettings.Locale[setting.Description]()}
>
    <Toggle bind:toggled={value} on:change={(e) => setting.Value = (e.target as HTMLInputElement).checked} />
</SettingItem>
