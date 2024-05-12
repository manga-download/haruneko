<script lang="ts">
    import { onMount } from 'svelte';
    import { PasswordInput } from 'carbon-components-svelte';
    import type { Secret } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Secret;
    let current: Secret;
    let value: string;

    onMount(() => {
        return () => {
            current?.Unsubscribe(OnValueChangedCallback);
        };
    });

    $: Update(setting);

    function Update(setting: Secret) {
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
    <PasswordInput
        hideLabel
        {value}
        on:change={(event) => (setting.Value = event.currentTarget['value'])}
    />
</SettingItem>
