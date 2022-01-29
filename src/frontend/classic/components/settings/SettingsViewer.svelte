<script lang="ts">
    import { Check, Choice } from '../../../../engine/SettingsManager';
    import InputCheck from './InputCheck.svelte';
    import InputChoice from './InputChoice.svelte';

    export let scope: string;
    $: settings = HakuNeko.SettingsManager.OpenScope(scope);
</script>

{#each [...settings] as setting}
    {#if setting instanceof Choice}
        <InputChoice setting={setting} />
    {/if}
    {#if setting instanceof Check}
        <InputCheck setting={setting} />
    {/if}
{/each}

<!--
<div class="text-input-wrapper">
    <SettingItem labelText="Demo Select" helperText="This is an example of helper text">
        {#if type === 'text'}
            <TextInput
                {placeholder}
                bind:value={storeValue}
                on:change={() =>
                    updateStoreValue(store, storageKey, storeValue, validator)}
            />
        {:else if type === 'number'}
            <NumberInput
                bind:value={storeValue}
                {min}
                {max}
                on:change={() =>
                    updateStoreValue(store, storageKey, storeValue, validator)}
            />
        {:else if type === 'file'}
            <FolderSelectorInput {storageKey} {store} componentId={storageKey} />
        {:else if type === 'password'}
            <PasswordInput
                hideLabel
                bind:value={storeValue}
                placeholder="Password"
                on:change={() =>
                    updateStoreValue(store, storageKey, storeValue, validator)}
            />
        {/if}
    </SettingItem>
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
-->
