<!-- Sample Implementation of Language Selection Control for HakuNeko -->
<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    import { CurrentLocale, Locales } from "../../../i18n/Localization";

    let locale = CurrentLocale().Code;
    HakuNeko.EventManager.LocaleChanged.Subscribe((_, code) => locale = code);
</script>

<!-- May also dispatch directly from DevTools => HakuNeko.EventManager.LocaleChanged.Dispatch(null, 'de_DE') -->
<Select selected={locale} on:change={evt => HakuNeko.EventManager.LocaleChanged.Dispatch(null, evt.detail)}>
    {#each Locales as locale}
        <SelectItem value={locale.Code} text={locale.Title} />
    {/each}
</Select>