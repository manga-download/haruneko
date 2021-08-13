<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    import { Theme } from "./Theme.svelte";

    export let selected: string | undefined;
    export let items: Theme[];
    export let onChange: (value: string | undefined) => void;
</script>

<Select
    {selected}
    on:change={(e) => {
        onChange(e.detail);
    }}
>
    {#each items as item}
        <SelectItem value={item.id} text={item.label} />
    {/each}
</Select>

<style>
</style>
