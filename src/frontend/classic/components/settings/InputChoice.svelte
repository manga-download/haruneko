<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    import type { Choice } from "../../../../engine/SettingsManager";
    import { LocaleValue } from "../../SettingsStore";
    import SettingItem from "./SettingItem.svelte";

    export let setting: Choice;
    let current: Choice;
    let value: string;

    $: Update(setting);

    function Update(setting: Choice) {
        if(current === setting) {
            return;
        }
        if(current) {
            current.ValueChanged.Unsubscribe(OnValueChangedCallback);
        }
        if(setting) {
            setting.ValueChanged.Subscribe(OnValueChangedCallback);
        }
        value = setting.Value;
        current = setting;
    }

    function OnValueChangedCallback(sender: Choice, args: string) {
        if(sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }
</script>

<SettingItem labelText={$LocaleValue[setting.Label]()} helperText={$LocaleValue[setting.Description]()}>
    <Select selected={value} on:change={evt => setting.Value = evt.detail}>
        {#each setting.Options as option}
            <SelectItem value={option.key} text={$LocaleValue[option.label]()} />
        {/each}
    </Select>
</SettingItem>