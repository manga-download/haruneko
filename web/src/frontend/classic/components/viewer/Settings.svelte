<script lang="ts">
    import { Select, SelectItem, Toggle } from 'carbon-components-svelte';
    import SettingItem from '../settings/SettingItem.svelte';
    import {
        Key,
        Locale,
        ViewerDoublePage,
        ViewerMode,
        ViewerReverseDirection,
    } from '../../stores/Settings';
</script>

<SettingItem
    labelText={$Locale[ViewerMode.setting.Label]()}
    helperText={$Locale[ViewerMode.setting.Description]()}
>
    <Select bind:selected={$ViewerMode}>
        {#each ViewerMode.setting.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>

{#if $ViewerMode === Key.ViewerMode_Paginated}
    <SettingItem
        labelText={$Locale[ViewerReverseDirection.setting.Label]()}
        helperText={$Locale[ViewerReverseDirection.setting.Description]()}
    >
        <Toggle bind:toggled={$ViewerReverseDirection} />
    </SettingItem>

    <SettingItem
        labelText={$Locale[ViewerDoublePage.setting.Label]()}
        helperText={$Locale[ViewerDoublePage.setting.Description]()}
    >
        <Toggle bind:toggled={$ViewerDoublePage} />
    </SettingItem>
{/if}
