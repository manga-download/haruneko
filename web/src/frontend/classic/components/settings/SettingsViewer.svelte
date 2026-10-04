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

    interface Props {
        settings: ISetting[];
    }

    let { settings }: Props = $props();

</script>
<form >
    {#each settings as setting (setting.ID)}
        {#if setting instanceof Choice}
            <InputChoice {setting} />
        {:else if setting instanceof Check}
            <InputCheck {setting} />
        {:else if setting instanceof Text}
            <InputText {setting} />
        {:else if setting instanceof Secret}
            <InputSecret {setting} />
        {:else if setting instanceof Numeric}
            <InputNumeric {setting} />
        {:else if setting instanceof Directory}
            <InputDirectory {setting} />
        {:else}
            <p>Unknown setting type: {setting.constructor.name}</p>
        {/if}
    {/each}
</form>

<style>
    form {
        margin-bottom: var(--margin-bottom, 0);
    }

</style>