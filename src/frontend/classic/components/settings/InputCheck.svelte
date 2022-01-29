<script lang="ts">
    import { Toggle } from "carbon-components-svelte";
    import type { Check } from "../../../../engine/SettingsManager";
    import { LocaleValue } from "../../SettingsStore";
    import SettingItem from "./SettingItem.svelte";

    export let setting: Check;
    let current: Check;
    let value: boolean;

    $: Update(setting);

    function Update(setting: Check) {
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

    function OnValueChangedCallback(sender: Check, args: boolean) {
        if(sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }
</script>

<SettingItem labelText={$LocaleValue[setting.Label]()} helperText={$LocaleValue[setting.Description]()}>
    <Toggle toggled={value} on:toggle={evt => setting.Value = evt.detail.toggled} />
</SettingItem>