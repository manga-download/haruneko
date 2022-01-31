<script lang="ts">
    import { PasswordInput } from "carbon-components-svelte";
    import type { Secret } from "../../../../engine/SettingsManager";
    import { Locale } from "../../SettingsStore";
    import SettingItem from "./SettingItem.svelte";

    export let setting: Secret;
    let current: Secret;
    let value: string;

    $: Update(setting);

    function Update(setting: Secret) {
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

    function OnValueChangedCallback(sender: Secret, args: string) {
        if(sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }
</script>

<SettingItem labelText={$Locale[setting.Label]()} helperText={$Locale[setting.Description]()}>
    <PasswordInput hideLabel value={value} on:change={event => setting.Value = event.currentTarget['value']} />
</SettingItem>