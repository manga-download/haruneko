<script lang="ts">
    import { TextInput } from 'carbon-components-svelte';
    import type { Directory } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Directory;
    let current: Directory;
    let value: FileSystemDirectoryHandle;

    $: Update(setting);

    function Update(setting: Directory) {
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

    function OnValueChangedCallback(
        sender: Directory,
        args: FileSystemDirectoryHandle
    ) {
        if (sender && sender !== current) {
            sender.ValueChanged.Unsubscribe(OnValueChangedCallback);
        } else {
            value = args;
        }
    }

    async function SelectFolder() {
        const directory = await window['showDirectoryPicker']({
            startIn: value ?? 'documents',
        });
        if (directory) {
            setting.Value = directory;
        }
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <TextInput
        style="cursor: pointer;"
        readonly
        value={value?.name}
        on:click={SelectFolder}
    />
</SettingItem>
