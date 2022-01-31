<script lang="ts">
    import { TextInput } from "carbon-components-svelte";
    import type { Path } from "../../../../engine/SettingsManager";
    import { Locale } from "../../SettingsStore";
    import SettingItem from "./SettingItem.svelte";

    export let setting: Path;
    let current: Path;
    let value: string;

    $: Update(setting);

    function Update(setting: Path) {
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

    function OnValueChangedCallback(sender: Path, args: string) {
        if(sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }
</script>

<SettingItem labelText={$Locale[setting.Label]()} helperText={$Locale[setting.Description]()}>
    <TextInput readonly value={value} />
    <label for={`folder-selector-${setting.ID}`}>🗁</label>
    <input id={`folder-selector-${setting.ID}`} type="file" on:change={event => setting.Value = event.currentTarget.value} />
</SettingItem>

<style>
    input[type="file"] {
        display: none;
    }
    label {
        display: inline-block;
        margin-top: 1rem;
        cursor: pointer;
    }
</style>