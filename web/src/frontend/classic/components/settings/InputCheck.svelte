<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Toggle } from 'carbon-components-svelte';
    import type { Check } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Check;
    }
    let { setting }: Props = $props();
    let value: boolean = $state(setting.Value);

    $effect(() => {
        setting.Value = value;
    });

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
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <Toggle bind:toggled={value} />
</SettingItem>
