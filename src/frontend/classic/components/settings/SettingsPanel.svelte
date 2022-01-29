<script lang="ts">
    import { Select, SelectItem, Toggle } from 'carbon-components-svelte';
    import type { Code } from '../../../../i18n/ILocale';
    import SettingItem from './SettingItem.svelte';
    import {
        ContentPanel,
        ContentPanelValue,
        Key,
        Locale,
        LocaleValue,
        Theme,
        ThemeValue,
        ViewerDoublePage,
        ViewerDoublePageValue,
        ViewerMode,
        ViewerModeValue,
        ViewerReverseDirection,
        ViewerReverseDirectionValue
    } from '../../SettingsStore';

    function dispatch(evt: CustomEvent<Code>): void {
        HakuNeko.EventManager.LocaleChanged.Dispatch(null, evt.detail);
    }
</script>

<div class="lang">
    <!-- TODO: Localize label an description for this property ... -->
    <SettingItem labelText="{Locale.Label}" helperText="{Locale.Description}">
        <Select selected={Locale.Value} on:change={dispatch}>
            {#each Locale.Options as option}
                <!-- Special Case: Do not localize the options of the localization chooser itself, show the resource keys directly! -->
                <SelectItem value={option.key} text={option.label} />
            {/each}
        </Select>
    </SettingItem>
</div>

<SettingItem labelText={$LocaleValue[ContentPanel.Label]()} helperText={$LocaleValue[ContentPanel.Description]()}>
    <Toggle toggled={$ContentPanelValue} on:toggle={evt => ContentPanel.Value = evt.detail.toggled} />
</SettingItem>

<SettingItem labelText={$LocaleValue[Theme.Label]()} helperText={$LocaleValue[Theme.Description]()}>
    <Select selected={$ThemeValue} on:change={evt => Theme.Value = evt.detail}>
        {#each Theme.Options as option}
            <SelectItem value={option.key} text={$LocaleValue[option.label]()} />
        {/each}
    </Select>
</SettingItem>

<SettingItem labelText={$LocaleValue[ViewerMode.Label]()} helperText={$LocaleValue[ViewerMode.Description]()}>
    <Select selected={$ViewerModeValue} on:change={evt => ViewerMode.Value = evt.detail}>
        {#each ViewerMode.Options as option}
            <SelectItem value={option.key} text={$LocaleValue[option.label]()} />
        {/each}
    </Select>
</SettingItem>

{#if $ViewerModeValue === Key.ViewerMode_Paginated}

    <SettingItem labelText={$LocaleValue[ViewerReverseDirection.Label]()} helperText={$LocaleValue[ViewerReverseDirection.Description]()}>
        <Toggle toggled={$ViewerReverseDirectionValue} on:toggle={evt => ViewerReverseDirection.Value = evt.detail.toggled} />
    </SettingItem>

    <SettingItem labelText={$LocaleValue[ViewerDoublePage.Label]()} helperText={$LocaleValue[ViewerDoublePage.Description]()}>
        <Toggle toggled={$ViewerDoublePageValue} on:toggle={evt => ViewerDoublePage.Value = evt.detail.toggled} />
    </SettingItem>

{/if}

<style>
    .lang {
        font-family: BabelStoneFlags;
    }
</style>