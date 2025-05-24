<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { TextInput } from 'carbon-components-svelte';
    import type { Directory } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Directory;
    export let inline = false;
    let value: FileSystemDirectoryHandle = setting.Value;

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });

    function OnValueChanged(newValue: FileSystemDirectoryHandle) {
        value = newValue;
    }

    async function SelectFolder() {
        try{
            const directory = await window['showDirectoryPicker']({
                startIn: value ?? 'documents',
            });
            if (directory) {
                setting.Value = directory;
            }
        } catch (error) {console.log('error')}
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
        {inline}
    />
</SettingItem>
