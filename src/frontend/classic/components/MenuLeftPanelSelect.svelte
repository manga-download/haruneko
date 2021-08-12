<script lang="ts">
    import { Select, SelectItem } from "carbon-components-svelte";
    export let selected: string | undefined;
    export let items: { value: string; text: string }[];
</script>

<Select {selected}>
    {#each items as item}
        <SelectItem value={item.value} text={item.text} />
    {/each}
</Select>

<style>
</style>
