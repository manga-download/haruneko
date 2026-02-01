<script lang="ts">
    import { Select, SelectItem, Toggle } from 'carbon-components-svelte';
    import SettingItem from '../settings/SettingItem.svelte';
    import { Key, GlobalSettings, Settings } from '../../stores/Settings.svelte';
</script>

<SettingItem
    labelText={GlobalSettings.Locale[Settings.ViewerMode.setting.Label]()}
    helperText={GlobalSettings.Locale[Settings.ViewerMode.setting.Description]()}
>
    <Select bind:selected={Settings.ViewerMode.value}>
        {#each Settings.ViewerMode.setting.Options as option}
            <SelectItem value={option.key} text={GlobalSettings.Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>

{#if Settings.ViewerMode.value === Key.ViewerMode_Paginated}
    <SettingItem
        labelText={GlobalSettings.Locale[Settings.ViewerReverseDirection.setting.Label]()}
        helperText={GlobalSettings.Locale[Settings.ViewerReverseDirection.setting.Description]()}
    >
        <Toggle bind:toggled={Settings.ViewerReverseDirection.value} />
    </SettingItem>

    <SettingItem
        labelText={GlobalSettings.Locale[Settings.ViewerDoublePage.setting.Label]()}
        helperText={GlobalSettings.Locale[Settings.ViewerDoublePage.setting.Description]()}
    >
        <Toggle bind:toggled={Settings.ViewerDoublePage.value} />
    </SettingItem>
{/if}
