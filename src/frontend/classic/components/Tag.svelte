<script lang="ts">
    import { Tag } from 'carbon-components-svelte';

    export let label = '';
    export let category = '';
    export let filter = false;

    const colorTranslator: Map<String, String> = new Map([
        ['default', 'gray'],
        ['Language', 'cyan'],
        ['Media', 'magenta'],
        ['Source', 'teal'],
    ]);
    let color: any = '';
    $: color = colorTranslator.has(category)
        ? colorTranslator.get(category)
        : colorTranslator.get('default');
</script>

<Tag {filter} type={color} on:click>
    <div class="tagContent {category}">{label}</div>
</Tag>

<style>
    .Language {
        font-family: BabelStoneFlags;
    }
    .tagContent {
        display: flex;
        align-items: center;
        user-select: none;
    }
</style>
