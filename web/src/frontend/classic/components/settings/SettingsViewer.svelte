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
    export let inline = false;
    export let style = null;

</script>
<form {style}>
    {#each settings as setting (setting.ID)}
        {#if setting instanceof Choice}
            <InputChoice {setting} {inline} />
        {:else if setting instanceof Check}
            <InputCheck {setting} />
        {:else if setting instanceof Text}
            <InputText {setting} {inline} />
        {:else if setting instanceof Secret}
            <InputSecret {setting} {inline} />
        {:else if setting instanceof Numeric}
            <InputNumeric {setting} />
        {:else if setting instanceof Directory}
            <InputDirectory {setting} {inline} />
        {:else}
            <p>Unknown setting type: {setting.constructor.name}</p>
        {/if}
    {/each}
</form>
