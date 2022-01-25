<script lang="ts">
    import {
        Tag
    } from "carbon-components-svelte";
    
    export let label='';
    export let category='';
    export let filter=false;

    const colorTranslator:Map<String,String> = new Map([['default','gray'],['lang', 'cyan'], ['type', 'magenta']]);
    let color:any = '';
    $: color = colorTranslator.has(category) ? colorTranslator.get(category) : colorTranslator.get('default');

</script>

<Tag filter={filter} type="{color}" on:click>
    <div class="tagContent">{label}</div>
</Tag>

<style>
    .tagContent {
        display: flex;
        align-items: center;
        user-select: none;
    }
</style>