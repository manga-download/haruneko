<script lang="ts">

    import { onMount, onDestroy } from 'svelte';
    import { Select, SelectItem } from 'carbon-components-svelte';
    import type { Choice } from '../../../../engine/SettingsManager';
    import { GlobalSettings } from '../../stores/Settings.svelte';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Choice;
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
    <Select bind:selected={value} onchange={(e) => (setting.Value = value)}>
        {#each setting.Options as option}
            <SelectItem value={option.key} text={GlobalSettings.Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>