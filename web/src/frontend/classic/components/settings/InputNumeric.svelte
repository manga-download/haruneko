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

    // Track if update is from external subscription to avoid infinite loop
    let isExternalUpdate = false;
    
    $effect(() => {
        if (!isExternalUpdate) {
            setting.Value = value;
        }
        isExternalUpdate = false;
    });

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });

    function OnValueChanged(newValue: number) {
        isExternalUpdate = true;
        value = newValue;
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <NumberInput bind:value min={setting.Min} max={setting.Max} />
</SettingItem>
