<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { NumberInput } from 'carbon-components-svelte';
    import type { Numeric } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Numeric;
    }
    let { setting }: Props = $props();
    let value: number = $state(setting.Value);

    $effect(() => {
        setting.Value = value;
    });

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
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <NumberInput bind:value min={setting.Min} max={setting.Max} />
</SettingItem>
