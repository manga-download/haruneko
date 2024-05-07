<script lang="ts">
    import { onMount } from 'svelte';
    import { TextInput } from 'carbon-components-svelte';
    import type { Directory } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Directory;
    let current: Directory;
    let value: FileSystemDirectoryHandle;

	onMount(() => {
		return () => {
			current?.Unsubscribe(OnValueChangedCallback);
		};
	});

    $: Update(setting);

    function Update(setting: Directory) {
        if (current !== setting) {
            current?.Unsubscribe(OnValueChangedCallback);
            setting?.Subscribe(OnValueChangedCallback);
            value = setting.Value;
            current = setting;
        }
    }

    function OnValueChangedCallback(val: FileSystemDirectoryHandle) {
        value = val;
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
