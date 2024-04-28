<script lang="ts">
    import { onMount } from 'svelte';
    import { Select, SelectItem } from 'carbon-components-svelte';
    import type { Choice } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Choice;
    let current: Choice;
    let value: string;

    onMount(() => {
        return () => {
            current?.Unsubscribe(OnValueChangedCallback);
        };
    });

    $: Update(setting);

    function Update(setting: Choice) {
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
    <Select
        selected={value}
        on:update={(evt) => (setting.Value = evt.detail.toString())}
    >
        {#each setting.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>
