<script lang="ts">
    import {
        TextInput,
        NumberInput,
        PasswordInput,
    } from "carbon-components-svelte";
    import type {
        SettingExtras,
        SettingValidator,
        SettingValue,
    } from "../utils/storage";
    import { onSettingChange } from "../utils/storage";
    import FolderSelectorInput from "./FolderSelectorInput.svelte";

    export let storageKey: string;
    export let extras: SettingExtras = undefined;
    export let validator: SettingValidator = undefined;
    export let passNewValueToExtras: boolean = false;
    export let placeholder: string = "";
    export let defaultValue: SettingValue;
    export let type: "number" | "text" | "file" | "password" = "text";
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;

    let value = defaultValue as string;
</script>

<div class="text-input-wrapper">
    {#if type === "text"}
        <TextInput
            {placeholder}
            bind:value
            on:change={() => {
                const extrasArg = passNewValueToExtras ? value : undefined;
                onSettingChange(
                    storageKey,
                    value,
                    validator,
                    extras,
                    extrasArg
                );
            }}
        />
    {:else if type === "number"}
        <NumberInput
            bind:value
            {min}
            {max}
            on:change={() => {
                const extrasArg = passNewValueToExtras ? value : undefined;
                onSettingChange(
                    storageKey,
                    value,
                    validator,
                    extras,
                    extrasArg
                );
            }}
        />
    {:else if type === "file"}
        <FolderSelectorInput
            {storageKey}
            path={value}
            componentId={storageKey}
        />
    {:else if type === "password"}
        <PasswordInput
            hideLabel
            bind:value
            placeholder="Password"
            on:change={() => {
                const extrasArg = passNewValueToExtras ? value : undefined;
                onSettingChange(
                    storageKey,
                    value,
                    validator,
                    extras,
                    extrasArg
                );
            }}
        />
    {/if}
</div>

<style>
    .text-input-wrapper {
        margin-top: 8px;
    }
</style>
