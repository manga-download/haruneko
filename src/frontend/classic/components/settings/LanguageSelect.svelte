<!-- Sample Implementation of Language Selection Control for HakuNeko -->
<script lang="ts">
    import { Select, SelectItem } from 'carbon-components-svelte';
    import type { Code } from '../../../../i18n/ILocale';
    import {
        Localizations,
        CurrentLocale,
    } from '../../../../i18n/Localization';

    let locale = CurrentLocale();
    HakuNeko.EventManager.LocaleChanged.Subscribe((_, code) => (locale = code));
    function dispatch(evt: CustomEvent<Code>): void {
        HakuNeko.EventManager.LocaleChanged.Dispatch(null, evt.detail);
    }
</script>

<!-- May also dispatch directly from DevTools => HakuNeko.EventManager.LocaleChanged.Dispatch(null, 'de_DE') -->
<Select selected={locale} on:change={dispatch}>
    {#each [...Localizations] as localization}
        <SelectItem value={localization.key} text={localization.name} />
    {/each}
</Select>
