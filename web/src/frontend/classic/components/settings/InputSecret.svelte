<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { PasswordInput } from 'carbon-components-svelte';
    import type { Secret } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Secret;
    }
    let { setting = $bindable() }: Props = $props();

    let value: string = $state(setting.Value);

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
    <PasswordInput hideLabel bind:value on:change={(e) => setting.Value = (e.target as HTMLInputElement).value} />
</SettingItem>
