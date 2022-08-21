<script lang="ts">
    import { Select, SelectItem } from 'carbon-components-svelte';
    import type { Choice } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Choice;
    let current: Choice;
    let value: string;

    $: Update(setting);

    function Update(setting: Choice) {
        if (current === setting) {
            return;
        }
        if (current) {
            current.ValueChanged.Unsubscribe(OnValueChangedCallback);
        }
        if (setting) {
            setting.ValueChanged.Subscribe(OnValueChangedCallback);
        }
        value = setting.Value;
        current = setting;
    }

    function OnValueChangedCallback(sender: Choice, args: string) {
        if (sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <Select
        selected={value}
        on:change={(evt) => (setting.Value = evt.detail.toString())}
    >
        {#each setting.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>
