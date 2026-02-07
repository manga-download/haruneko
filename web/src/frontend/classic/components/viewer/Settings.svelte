<script lang="ts">
    import { Select, SelectItem, Toggle } from 'carbon-components-svelte';
    import SettingItem from '../settings/SettingItem.svelte';
    import { Key, GlobalSettings, Settings } from '../../stores/Settings.svelte';
</script>

<SettingItem
    labelText={GlobalSettings.Locale[Settings.ViewerMode.Setting.Label]()}
    helperText={GlobalSettings.Locale[Settings.ViewerMode.Setting.Description]()}
>
    <Select bind:selected={Settings.ViewerMode.Value}>
        {#each Settings.ViewerMode.Setting.Options as option}
            <SelectItem value={option.key} text={GlobalSettings.Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>

{#if Settings.ViewerMode.Value === Key.ViewerMode_Paginated}
    <SettingItem
        labelText={GlobalSettings.Locale[Settings.ViewerReverseDirection.Setting.Label]()}
        helperText={GlobalSettings.Locale[Settings.ViewerReverseDirection.Setting.Description]()}
    >
        <Toggle bind:toggled={Settings.ViewerReverseDirection.Value} />
    </SettingItem>

    <SettingItem
        labelText={GlobalSettings.Locale[Settings.ViewerDoublePage.Setting.Label]()}
        helperText={GlobalSettings.Locale[Settings.ViewerDoublePage.Setting.Description]()}
    >
        <Toggle bind:toggled={Settings.ViewerDoublePage.Value} />
    </SettingItem>
{/if}
