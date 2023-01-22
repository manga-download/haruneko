<script lang="ts">
    import { ISettings, Check, Choice, Numeric, Directory, Secret, Text } from '../../../../engine/SettingsManager';
    import InputCheck from './InputCheck.svelte';
    import InputChoice from './InputChoice.svelte';
    import InputNumeric from './InputNumeric.svelte';
    import InputDirectory from './InputDirectory.svelte';
    import InputSecret from './InputSecret.svelte';
    import InputText from './InputText.svelte';

    export let settings: ISettings;
</script>

{#each [...settings] as setting}
    {#if setting instanceof Choice}
        <InputChoice setting={setting} />
    {/if}
    {#if setting instanceof Check}
        <InputCheck setting={setting} />
    {/if}
    {#if setting instanceof Text}
        <InputText setting={setting} />
    {/if}
    {#if setting instanceof Secret}
        <InputSecret setting={setting} />
    {/if}
    {#if setting instanceof Numeric}
        <InputNumeric setting={setting} />
    {/if}
    {#if setting instanceof Directory}
        <InputDirectory setting={setting} />
    {/if}
{/each}