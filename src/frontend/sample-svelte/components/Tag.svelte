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

    const flagTranslator:Map<string,string> = new Map([
        ['English','https://openmoji.org/data/color/svg/1F1EC-1F1E7.svg'],
        ['French', 'https://openmoji.org/data/color/svg/1F1EB-1F1F7.svg'],
    ]);
    let flag:any='';
    $: flag = (category === 'lang') ?  ( flagTranslator.has(label) ? flagTranslator.get(label) : '') : '';
</script>

<Tag filter={filter} type="{color}" on:click>
    {#if category === 'lang' && flag !== ''}
        <img style="height:1.5em" alt="{label}" src="{flag}"/>{label}
    {:else}
        {label}
    {/if}
</Tag>