<script lang="ts">
    import { TextInput } from "carbon-components-svelte";
    import { v4 as uuidv4 } from "uuid";

    const uuid = uuidv4();

    export let labelText = "Select directory";
    let path: string = "";
</script>

<div>
    <TextInput readonly value={path} />
    <label for={`folder-selector-${uuid}`}>{labelText}</label>
    <input
        id={`folder-selector-${uuid}`}
        type="file"
        nwdirectory
        bind:value={path}
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
