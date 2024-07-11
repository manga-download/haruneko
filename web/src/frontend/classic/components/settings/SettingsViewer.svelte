<script lang="ts">
    import {
        type ISetting,
        Check,
        Choice,
        Numeric,
        Directory,
        Secret,
        Text,
    } from '../../../../engine/SettingsManager';
    import InputCheck from './InputCheck.svelte';
    import InputChoice from './InputChoice.svelte';
    import InputNumeric from './InputNumeric.svelte';
    import InputDirectory from './InputDirectory.svelte';
    import InputSecret from './InputSecret.svelte';
    import InputText from './InputText.svelte';

    export let settings: ISetting[];
</script>

{#each settings as setting (setting.ID)}
    {#if setting instanceof Choice}
        <InputChoice {setting} />
    {/if}
    {#if setting instanceof Check}
        <InputCheck {setting} />
    {/if}
    {#if setting instanceof Text}
        <InputText {setting} />
    {/if}
    {#if setting instanceof Secret}
        <InputSecret {setting} />
    {/if}
    {#if setting instanceof Numeric}
        <InputNumeric {setting} />
    {/if}
    {#if setting instanceof Directory}
        <InputDirectory {setting} />
    {/if}
{/each}
