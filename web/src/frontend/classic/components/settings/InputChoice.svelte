<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Select, SelectItem } from 'carbon-components-svelte';
    import type { Choice } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    interface Props {
        setting: Choice;
    }
    let { setting }: Props = $props();
    let value: string = $state(setting.Value);

    $effect(() => {
        setting.Value = value;
    });

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
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <Select bind:selected={value}>
        {#each setting.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>
