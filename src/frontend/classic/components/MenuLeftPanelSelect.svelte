<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    export let labelText: string;
    export let helperText: string = "";
    export let selected: string | undefined;
    export let items: { value: string; text: string }[];
</script>

<Select class="select" {labelText} {selected} {helperText} light>
    {#each items as item}
        <SelectItem value={item.value} text={item.text} />
    {/each}
</Select>

<style>
</style>
