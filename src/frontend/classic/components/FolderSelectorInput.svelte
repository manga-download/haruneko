<script lang="ts">
    import { TextInput } from "carbon-components-svelte";
    import { onSettingChange } from "../utils/storage";
    import type { SettingExtras, SettingValidator } from "../utils/storage";
    import { v4 as uuidv4 } from "uuid";

    export let labelText = "Select directory";
    export let storageKey: string | undefined = undefined;
    export let extras: SettingExtras = undefined;
    export let validator: SettingValidator = undefined;
    export let passNewValueToExtras: boolean = false;
    export let path: string = "";

    const uuid = uuidv4();
</script>

<div>
    <TextInput readonly value={path} />
    <label for={`folder-selector-${uuid}`}>{labelText}</label>
    <input
        id={`folder-selector-${uuid}`}
        type="file"
        nwdirectory
        bind:value={path}
        on:change={() => {
            if (storageKey) {
                const extrasArg = passNewValueToExtras ? path : undefined;
                onSettingChange(storageKey, path, validator, extras, extrasArg);
            }
        }}
    />
</div>

<style>
    input[type="file"] {
        display: none;
    }

    label {
        display: inline-block;
        margin-top: 1rem;
        cursor: pointer;
    }
</style>
