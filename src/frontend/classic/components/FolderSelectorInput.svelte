<script lang="ts">
    import { TextInput, Button } from "carbon-components-svelte";

    export let labelText = "Select directory";
    let path: string = "";
</script>

<div>
    <TextInput readonly value={path} />
    <label for="folder-selector">{labelText}</label>
    <input id="folder-selector" type="file" nwdirectory bind:value={path} />
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
