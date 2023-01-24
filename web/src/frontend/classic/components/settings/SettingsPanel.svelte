<script lang="ts">
    import { Select, SelectItem, Toggle } from 'carbon-components-svelte';
    import SettingItem from './SettingItem.svelte';
    import {
        ContentPanel,
        ContentPanelValue,
        Key,
        Locale,
        FuzzySearch,
        FuzzySearchValue,
        Theme,
        ThemeValue,
        ViewerDoublePage,
        ViewerDoublePageValue,
        ViewerMode,
        ViewerModeValue,
        ViewerReverseDirection,
        ViewerReverseDirectionValue,
    } from '../../stores/Settings';
</script>

<SettingItem
    labelText={$Locale[ContentPanel.Label]()}
    helperText={$Locale[ContentPanel.Description]()}
>
    <Toggle
        toggled={$ContentPanelValue}
        on:toggle={(evt) => (ContentPanel.Value = evt.detail.toggled)}
    />
</SettingItem>

<SettingItem
    labelText={$Locale[Theme.Label]()}
    helperText={$Locale[Theme.Description]()}
>
    <Select
        selected={$ThemeValue}
        on:update={(evt) => (Theme.Value = evt.detail.toString())}
    >
        {#each Theme.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>

<SettingItem
    labelText={$Locale[ViewerMode.Label]()}
    helperText={$Locale[ViewerMode.Description]()}
>
    <Select
        selected={$ViewerModeValue}
        on:update={(evt) => (ViewerMode.Value = evt.detail.toString())}
    >
        {#each ViewerMode.Options as option}
            <SelectItem value={option.key} text={$Locale[option.label]()} />
        {/each}
    </Select>
</SettingItem>

{#if $ViewerModeValue === Key.ViewerMode_Paginated}
    <SettingItem
        labelText={$Locale[ViewerReverseDirection.Label]()}
        helperText={$Locale[ViewerReverseDirection.Description]()}
    >
        <Toggle
            toggled={$ViewerReverseDirectionValue}
            on:toggle={(evt) =>
                (ViewerReverseDirection.Value = evt.detail.toggled)}
        />
    </SettingItem>

    <SettingItem
        labelText={$Locale[ViewerDoublePage.Label]()}
        helperText={$Locale[ViewerDoublePage.Description]()}
    >
        <Toggle
            toggled={$ViewerDoublePageValue}
            on:toggle={(evt) => (ViewerDoublePage.Value = evt.detail.toggled)}
        />
    </SettingItem>
{/if}

<SettingItem
    labelText={$Locale[FuzzySearch.Label]()}
    helperText={$Locale[FuzzySearch.Description]()}
>
    <Toggle
        toggled={$FuzzySearchValue}
        on:toggle={(evt) => (FuzzySearch.Value = evt.detail.toggled)}
    />
</SettingItem>
