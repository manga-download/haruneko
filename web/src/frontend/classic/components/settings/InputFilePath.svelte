<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { TextInput, Button } from 'carbon-components-svelte';
    import Close from 'carbon-icons-svelte/lib/Close.svelte';
    import type { Text } from '../../../../engine/SettingsManager';
    import { Locale } from '../../stores/Settings';
    import SettingItem from './SettingItem.svelte';

    export let setting: Text;
    let value: string = setting.Value;

    $: setting.Value = value;

    const isElectron = !!globalThis.ipcRenderer;

    onMount(() => {
        setting.Subscribe(OnValueChanged);
    });
    onDestroy(() => {
        setting.Unsubscribe(OnValueChanged);
    });

    function OnValueChanged(newValue: string) {
        value = newValue;
    }

    async function BrowseFile() {
        if (!isElectron) return;
        const { PickExternalViewer } = await import('../../../../engine/platform/electron/FileExplorer');
        const picked = await PickExternalViewer();
        if (picked) {
            value = picked;
        }
    }

    function Clear() {
        value = '';
    }
</script>

<SettingItem
    labelText={$Locale[setting.Label]()}
    helperText={$Locale[setting.Description]()}
>
    <div class="filepath-input">
        {#if isElectron}
            <TextInput
                style="cursor: pointer;"
                readonly
                {value}
                placeholder="Click to select a program..."
                on:click={BrowseFile}
            />
        {:else}
            <TextInput bind:value placeholder="Path to external viewer program" />
        {/if}
        {#if value}
            <Button
                size="small"
                kind="ghost"
                icon={Close}
                iconDescription="Clear"
                on:click={Clear}
            />
        {/if}
    </div>
</SettingItem>

<style>
    .filepath-input {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
</style>
